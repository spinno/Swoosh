mongoose = require 'mongoose'

module.exports = (name, attributes, methods, publicAttr) ->

	getPub = (entity) -> if publicAttr then generated.pub entity else entity

	generated = {}
	pub = false
	schema = new mongoose.Schema(attributes)
	generated.model = mongoose.model(name, schema)

	if publicAttr
		generated.pub = (entity) ->
			retval = {}
			for x in publicAttr
				retval[x] = entity[x]
			retval


	generated.get = (id, fn) ->
		cb = fn ? ->
		if id
			generated.model.findById id, (err, entity) ->
				if err then cb err
				else cb null, entity
		else
			generated.model.find {}, (err, entitys) ->
				if err then cb err
				else cb null, entitys


	generated.post = (data, fn) ->
		cb = fn ? ->
		posting = new generated.model(data)
		posting.save (err) ->
			if err
				cb err
			else
				cb null, posting


	generated.put = (id, data, fn) ->
		cb = fn ? ->
		generated.model.findById id, (err, entity) ->
			if err then cb err
			else
				for attr of data
					entity[attr] = data[attr]
				entity.save (err) ->
					if err then cb err
					else cb null, entity
 
	generated.route = (app) ->
		if "get" in methods
			app.get "/persistent/#{name}/:id?", (req, res) ->
				generated.get req.params.id, (err, response) ->
					if err
						res.send 500, err
					else if req.params.id
						res.send getPub(response)
					else
						res.send (
							for x in response 
								getPub x)

		if "post" in methods
			app.post "/persistent/#{name}", (req, res) ->
				generated.post req.body, (err, response) ->
					if err
						res.send 500, err
					else
						res.send getPub(response)

		if "put" in methods
			app.put "/persistent/#{name}/:id", (req, res) ->
				generated.put req.params.id, req.body, (err, response) ->
					if err
						res.send 500, err
					else
						res.send response



	generated
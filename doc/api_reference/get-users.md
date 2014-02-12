<div style="padding: 16px; border: solid red 1px;">
NOTE: This doc is an example
</div>

# GET USERS

## DESCRIPTION

Return a user

## HTTP METHOD

GET

## URL STRUCTURE

```
http://localhost:3000/api/users
```

## THROTTLING

None

## QUERY PARAMS

* param1: description for this param
* param2: description for this param

## RETURNS (JSON)

* HTTP 200 OK
	* JSON array with users. Each user:
		* id: mongo user id
		* name: The user's name
		* email: The user's email
		* image: The url to user's picture

## ERRORS

* HTTP 404 Not found
	* JSON object with:
		* error_code: 342
		* error_description: 'dfadsfadsfdsfadsf'
* HTTP 403 Forbidden
	* JSON object with:
		* error_code: 4123
		* error_description: 'dsfadklsf jadsflñkads fjdslfkds'

# RAW TRACE

```HTTP
 GET http://localhost:3000/api/users HTTP/1.1
 Host: localhost:3000
 Accept: application/json
 Accept-Language: es-es,en;q=0.8,es;q=0.5,en-us;q=0.3
 Proxy-Connection: keep-alive
 Pragma: no-cache
 Cache-Control: no-cache

 HTTP/1.0 200 OK
 Date: Mon, 05 Nov 2012 10:13:34 GMT
 Content-Type: application/json

[
	{
		'id': '856dft8f9y8h0ij8hn9y7f79t',
		'name': 'Fulanito',
		'email': 'fgomez@email.com',
		'image': 'http://localhost/img/97yf8t6dr54d78tfg7tf685.jpg'
	},
	{
		'id': 'sdr6ft7y8hu9id6ft7gy8hu',
		'name': 'Enriqueta',
		'email': 'emartinez@email.com',
		'image': 'http://localhost/img/se5dr6ft7gy8hu9ij0o.jpg'
	}
]
```

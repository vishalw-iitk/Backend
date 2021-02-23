require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
app.use(express.json())


const posts = [
	{
	    username: 'Vishal',
	    title: 'Post 1'
    },
    {
        username: 'Tina',
	    title: 'Post 2'
    }
]

// app.get('/posts', (req, res)=>{
// 	res.json(posts)
// })

app.get('/posts', authenticateToken, (req, res)=>{
	res.json(posts.filter(post=>post.username === req.user.name)) 
})

app.post('/login', (req, res)=>{
	const username = req.body.username
	const user = {name: username}
	const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)
	res.json({ accessToken : accessToken })
})

function authenticateToken(req, res, next){
	const authHeader = req.headers['authorization']
	// const token = authHeader && authHeader.split(' ')[1]
    const token = authHeader && Object.keys(req.headers)[2]
    console.log(Object.keys(req.headers))
    console.log(process.env.ACCESS_TOKEN_SECRET)
	if(token == null) return res.sendStatus(401)
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user)=>{
		if(err) return res.sendStatus(403) //expired token error
		req.user = user
		next()
    })
}




app.listen(3000, ()=>console.log("Server started"))
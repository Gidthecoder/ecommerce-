var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var jwt = require('jsonwebtoken'); //to be downloaded
var file = require('fs');
var bcrypt = require('bcryptjs')

var smtpTransport = nodemailer.createTransport({
	service: "Gmail",
	auth: {
		user: "akinsanmi20700@gmail.com",
		pass: "alex100206060"
	}
});

var rand, mailOptions, host, links;




/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/usersignup', function(req, res){
	let date = new Date();
	//adding and checking the details in the file system
	file.readFile(path.join(__dirname+'/users.json'), 'utf8', 
	function(err, data) {
	   let d = JSON.parse(data);
	   
	   let aa = d.filter(obj => obj.email.startsWith(req.query.email))
	   
	   //if email exist
	   if(aa.length == 1) {return res.send('this email already exist')}
	   if(!req.query.email || !req.query.password || !req.query.username ) {res.send('all info must be provided')}   
	   else {
		   let hassedpassword = bcrypt.hashSync(req.query.password, 10)
		   let infoToPass = {email: req.query.email, password: hassedpassword, username: req.query.username, verified: false}
		   //push to new user info to the json file
		   d.push(infoToPass)
		   //convert to json and save it to the json file
		   stringified = JSON.stringify(d)
		   file.writeFile(path.join(__dirname+'/users.json'), stringified, 'utf-8', function(err){if(err) throw err});
		   res.status(200).send(`check your email ${req.query.email} to complete your registration`)
		   
		   //send the mail
		   let mail ={"mail": req.query.email, "created":date.toString() }
		   let mail_verification = jwt.sign(mail, 'AGHH123@!', {expiresIn: '1d'})
		   host = req.get('host');
	       link = 'http://'+req.get('host')+'/verify?id='+mail_verification;
	
		   mailOptions = {
			from: "akinsanmi20700@gmail.com",
			to: req.query.email,
			subject: 'please confirm your email account',
			html: "click on the <a href="+link+">link</a> to verify"
		   }
	   
	       console.log(mailOptions);
	   
	       try {
			smtpTransport.sendMail(mailOptions, function(error, response){
				if(error) {
				console.log(error);
				res.end('error');
				}
				else {
				console.log('message sent');
				res.send('message sent');
				}
			})
		   } catch(err) {console.log(err)} 
	   } 
    })
})


module.exports = router;

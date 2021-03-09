// 

var PORT = 20127;
var HOST = require('ip').address();

const express = require('express');
const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

var dgram = require('dgram');
var server = dgram.createSocket('udp4');

let obj = {};

server.on('listening', function () {
    var address = server.address();
    //console.log('UDP Server listening on ' + address.address + ":" + address.port);
	console.log('In Dirt please set Data Out IP Address to ' + address.address + ' and Data Out IP Port to ' + address.port);
	console.log('UDP section in: C:\Users\Logan\Documents\My Games\DiRT Rally 2.0\hardwaresettings\hardware_settings_config.xml');
});

server.on('message', function (message, remote) {
	// following came from here: https://docs.google.com/spreadsheets/u/0/d/1UTgeE7vbnGIzDz-URRk2eBIPc_LR1vWcZklp7xD9N0Y/htmlview# 
	
    obj.time = message.readInt32LE(0);
    obj.timeOfCurrentLap = message.readUInt32LE(4); 
    obj.distanceDrivenOnCurrentLap = message.readFloatLE(8);
    obj.distanceDrivenOverall = message.readFloatLE(12);
    
	obj.positionX = message.readFloatLE(16);
	obj.positionY = message.readFloatLE(20); 
    obj.positionZ = message.readFloatLE(24);
	
    obj.speed = message.readFloatLE(28) * 2.23694; // default in m/s
    obj.velocityX = message.readFloatLE(32); 
    obj.velocityY = message.readFloatLE(36);
    obj.velocityZ = message.readFloatLE(40);

    obj.rollVelocityX = message.readFloatLE(44); 
    obj.rollVelocityY = message.readFloatLE(48);
    obj.rollVelocityZ = message.readFloatLE(52);

    obj.pitchVectorX = message.readFloatLE(56);
    obj.pitchVectorY = message.readFloatLE(60);
    obj.pitchVectorZ = message.readFloatLE(64);

    obj.positionOfSuspensionRearLeft = message.readFloatLE(68); 
    obj.positionOfSuspensionRearRight = message.readFloatLE(72);
    obj.positionOfSuspensionFrontLeft = message.readFloatLE(76);
    obj.positionOfSuspensionFrontRight = message.readFloatLE(80);

    obj.velocityOfSuspensionRearLeft = message.readFloatLE(84); 
    obj.velocityOfSuspensionRearRight = message.readFloatLE(88);
    obj.velocityOfSuspensionFrontLeft = message.readFloatLE(92);
    obj.velocityOfSuspensionFrontRight = message.readFloatLE(96);

    obj.velocityOfWheelRearLeft = message.readFloatLE(100); // Wheel rotation speed radians/sec.
    obj.velocityOfWheelRearRight = message.readFloatLE(104);
    obj.velocityOfWheelFrontLeft = message.readFloatLE(108);
	obj.velocityOfWheelFrontRight = message.readFloatLE(112);

    obj.throttlePosition = message.readFloatLE(116); 
    obj.steerPosition = message.readFloatLE(120);
    obj.brakePosition = message.readFloatLE(124);
    obj.clutchPosition = message.readFloatLE(128);

    obj.gear = message.readFloatLE(132);
	
    obj.lateralGForce = message.readFloatLE(136);
    obj.longitudinalGForce= message.readFloatLE(140);
	
    obj.currentLap = message.readFloatLE(144);

    obj.currentEngineRpm = message.readFloatLE(148) * 10; // rpm 
	
	/* // the following are unknown
    obj.surfaceRumbleFrontRight = message.readFloatLE(152);
    obj.surfaceRumbleRearLeft = message.readFloatLE(156);
    obj.surfaceRumbleRearRight = message.readFloatLE(160);
    obj.tireSlipAngleFrontLeft = message.readFloatLE(164); 
    obj.tireSlipAngleFrontRight = message.readFloatLE(168);
    obj.tireSlipAngleRearLeft = message.readFloatLE(172);
    obj.tireSlipAngleRearRight = message.readFloatLE(176);
    obj.tireCombinedSlipFrontLeft = message.readFloatLE(180); 
    obj.tireCombinedSlipFrontRight = message.readFloatLE(184);
    obj.tireCombinedSlipRearLeft = message.readFloatLE(188);
    obj.tireCombinedSlipRearRight = message.readFloatLE(192);
    obj.suspensionTravelMetersFrontLeft = message.readFloatLE(196); 
	obj.suspensionTravelMetersFrontRight = message.readFloatLE(200);
	*/ 
    
    obj.brakeTempRearLeft = message.readFloatLE(204);
    obj.brakeTempRearRight = message.readFloatLE(208);
    obj.brakeTempFrontLeft = message.readFloatLE(212);
    obj.brakeTempFrontRight = message.readFloatLE(216); 
	
	/* // the following is unknown 
    obj.carPerformanceIndex = message.readInt32LE(220); 
    obj.drivetrainType = message.readInt32LE(224); 
    obj.numCylinders = message.readInt32LE(228); 

	*/ 
	obj.numberOfTotalLaps = message.readFloatLE(240);
    obj.lengthOfTrack = message.readFloatLE(244);
	
    // obj.positionY = message.readFloatLE(248); // unknown
    
	obj.maxEngineSpeed = message.readFloatLE(252); // redline rpm

    //console.log(remote.address + ':' + remote.port + ' - RPM: ' + ~~obj.currentEngineRpm + ' Gear:' + obj.gear + ' Speed: ' + ~~obj.speed);
	var outString = new Date(Date.now()).toString() + ', ' + obj.positionX + ', ' + obj.positionY + ', ' + obj.positionZ + ', ' + obj.speed + '\r\n';
	const fs = require('fs');

	fs.appendFileSync('output.csv', outString);
});

server.bind(PORT, HOST);

app.get('/',(req,res)=>{
    return res.send();
})

app.get('/data', function (req, res) {
    return res.send(obj);
});
   

app.listen(8080,()=>{
    console.log("Started");
});
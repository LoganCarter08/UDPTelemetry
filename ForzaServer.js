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
	console.log('In Forza please set Data Out IP Address to ' + address.address + ' and Data Out IP Port to ' + address.port);
});

server.on('message', function (message, remote) {
    obj.isRaceOn = message.readInt32LE(0);
    obj.timestampMS = message.readUInt32LE(4); 
    obj.engineMaxRpm = message.readFloatLE(8);
    obj.engineIdleRpm = message.readFloatLE(12);
    obj.currentEngineRpm = message.readFloatLE(16);

    obj.accelerationX = message.readFloatLE(20); //In the car's local space; X = right, Y = up, Z = forward
    obj.accelerationY = message.readFloatLE(24);
    obj.accelerationZ = message.readFloatLE(28);

    obj.velocityX = message.readFloatLE(32); //In the car's local space; X = right, Y = up, Z = forward
    obj.velocityY = message.readFloatLE(36);
    obj.velocityZ = message.readFloatLE(40);

    obj.angularVelocityX = message.readFloatLE(44); //In the car's local space; X = pitch, Y = yaw, Z = roll
    obj.angularVelocityY = message.readFloatLE(48);
    obj.angularVelocityZ = message.readFloatLE(52);

    obj.yaw = message.readFloatLE(56);
    obj.pitch = message.readFloatLE(60);
    obj.roll = message.readFloatLE(64);

    obj.normalizedSuspensionTravelFrontLeft = message.readFloatLE(68); // Suspension travel normalized: 0.0f = max stretch; 1.0 = max compression
    obj.normalizedSuspensionTravelFrontRight = message.readFloatLE(72);
    obj.normalizedSuspensionTravelRearLeft = message.readFloatLE(76);
    obj.normalizedSuspensionTravelRearRight = message.readFloatLE(80);

    obj.tireSlipRatioFrontLeft = message.readFloatLE(84); // Tire normalized slip ratio, = 0 means 100% grip and |ratio| > 1.0 means loss of grip.
    obj.tireSlipRatioFrontRight = message.readFloatLE(88);
    obj.tireSlipRatioRearLeft = message.readFloatLE(92);
    obj.tireSlipRatioRearRight = message.readFloatLE(96);

    obj.wheelRotationSpeedFrontLeft = message.readFloatLE(100); // Wheel rotation speed radians/sec.
    obj.wheelRotationSpeedFrontRight = message.readFloatLE(104);
    obj.wheelRotationSpeedRearLeft = message.readFloatLE(108);
    obj.wheelRotationSpeedRearRight = message.readFloatLE(112);

    obj.wheelOnRumbleStripFrontLeft = message.readFloatLE(116); // = 1 when wheel is on rumble strip, = 0 when off.
    obj.wheelOnRumbleStripFrontRight = message.readFloatLE(120);
    obj.wheelOnRumbleStripRearLeft = message.readFloatLE(124);
    obj.wheelOnRumbleStripRearRight = message.readFloatLE(128);

    obj.wheelInPuddleDepthFrontLeft = message.readFloatLE(132); // = from 0 to 1, where 1 is the deepest puddle
    obj.wheelInPuddleDepthFrontRight = message.readFloatLE(136);
    obj.wheelInPuddleDepthRearLeft = message.readFloatLE(140);
    obj.wheelInPuddleDepthRearRight = message.readFloatLE(144);

    obj.surfaceRumbleFrontLeft = message.readFloatLE(148); // Non-dimensional surface rumble values passed to controller force feedback
    obj.surfaceRumbleFrontRight = message.readFloatLE(152);
    obj.surfaceRumbleRearLeft = message.readFloatLE(156);
    obj.surfaceRumbleRearRight = message.readFloatLE(160);

    obj.tireSlipAngleFrontLeft = message.readFloatLE(164); // Tire normalized slip angle, = 0 means 100% grip and |angle| > 1.0 means loss of grip.
    obj.tireSlipAngleFrontRight = message.readFloatLE(168);
    obj.tireSlipAngleRearLeft = message.readFloatLE(172);
    obj.tireSlipAngleRearRight = message.readFloatLE(176);

    obj.tireCombinedSlipFrontLeft = message.readFloatLE(180); // Tire normalized combined slip, = 0 means 100% grip and |slip| > 1.0 means loss of grip.
    obj.tireCombinedSlipFrontRight = message.readFloatLE(184);
    obj.tireCombinedSlipRearLeft = message.readFloatLE(188);
    obj.tireCombinedSlipRearRight = message.readFloatLE(192);

    obj.suspensionTravelMetersFrontLeft = message.readFloatLE(196); // Actual suspension travel in meters
    obj.suspensionTravelMetersFrontRight = message.readFloatLE(200);
    obj.suspensionTravelMetersRearLeft = message.readFloatLE(204);
    obj.suspensionTravelMetersRearRight = message.readFloatLE(208);

    obj.carOrdinal = message.readInt32LE(212); //Unique ID of the car make/model
    obj.carClass = message.readInt32LE(216); //Between 0 (D -- worst cars) and 7 (X class -- best cars) inclusive 
    obj.carPerformanceIndex = message.readInt32LE(220); //Between 100 (slowest car) and 999 (fastest car) inclusive
    obj.drivetrainType = message.readInt32LE(224); //Corresponds to EDrivetrainType; 0 = FWD, 1 = RWD, 2 = AWD
    obj.numCylinders = message.readInt32LE(228); //Number of cylinders in the engine
	
	
	// The following may be split like this or we may be missing values. Unsure. 
	

    //Position (meters)
    obj.positionX = message.readFloatLE(244);
    obj.positionY = message.readFloatLE(248);
    obj.positionZ = message.readFloatLE(252);
    obj.speed = message.readFloatLE(256) * 2.2369; // meters per second
    obj.power = message.readFloatLE(260); // watts
    obj.torque = message.readFloatLE(264); // newton meter

    obj.tireTempFrontLeft = message.readFloatLE(268);
    obj.tireTempFrontRight = message.readFloatLE(272);
    obj.tireTempRearLeft = message.readFloatLE(276);
    obj.tireTempRearRight = message.readFloatLE(280);

    obj.boost = message.readFloatLE(284);
    obj.fuel = message.readFloatLE(288);
    obj.distanceTraveled = message.readFloatLE(292);
    obj.bestLap = message.readFloatLE(296); // seconds
    obj.lastLap = message.readFloatLE(300); // seconds
    obj.currentLap = message.readFloatLE(304); // seconds
    obj.currentRaceTime = message.readFloatLE(308); // seconds

    obj.lapNumber = message.readUInt16LE(312);
    obj.racePosition = message.readUInt8(314);

    obj.accel = message.readUInt8(315); // 0 - 255
    obj.brake = message.readUInt8(316); // 0 - 255
    obj.clutch = message.readUInt8(317);
    obj.handBrake = message.readUInt8(318);
    obj.gear = message.readUInt8(319);
    obj.steer = message.readUInt8(320);

    obj.normalizedDrivingLine = message.readUInt8(321);
    obj.normalizedAIBrakeDifference = message.readUInt8(322);

    //console.log(remote.address + ':' + remote.port + ' - RPM: ' + ~~obj.currentEngineRpm + ' Gear:' + obj.gear + ' Speed: ' + ~~obj.speed);
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
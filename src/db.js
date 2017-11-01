import * as firebase from "firebase";


export default class DB {
	constructor(firstName, lastName) {

		var config = {
			apiKey: "AIzaSyCyZ4mlZFrTS9RiiDoR-YRn0cBA6GxySvc",
			authDomain: "fishtank-b6f1f.firebaseapp.com",
			databaseURL: "https://fishtank-b6f1f.firebaseio.com",
			projectId: "fishtank-b6f1f",
			storageBucket: "",
			messagingSenderId: "995746268808"
		};

		this.firstName = firstName;
		this.lastName = lastName;

		firebase.initializeApp(config);
	}
	getFullName() {
		return this.firstName + ' ' + this.lastName;
	}
	setupFish(callBackAdd,callBackUpdate,callBackRemove) {
		var fishRef = firebase.database().ref("fish/");
		fishRef.on('child_added', function(data,prev){
			const fish = data.val()
			console.log(data.key + "+>" +fish.age)
			if(callBackAdd) callBackAdd(data.key,fish)
		});
		fishRef.on("child_changed", function(data) {
			const fish = data.val()
			console.log(data.key + "=>" +fish.age)
			if(callBackUpdate) callBackUpdate(data.key,fish)
		})
		fishRef.on("child_removed", function(data) {
			const fish = data.val()
			console.log(data.key + "->" +fish.age)
			if(callBackRemove) callBackRemove(data.key,fish)
		})
	}

	pushFish(){
		console.log("Push Fish");
		firebase.database().ref("fish/").push({

			number: 1,
			age: 30,
			size: 100

		});
	}

	initFish() {
		console.log("initFish")
		console.log(firebase.database())
		var playersRef = firebase.database().ref("fish/");

		playersRef.set({
			Pieter: {
				number: 1,
				age: 30,
				size: 100
			},

			Willem: {
				number: 2,
				age: 20,
				size: 20
			},
			Armand: {
				number: 3,
				age: 25,
				size: 1000
			},
			Jeltjo: {
				number: 4,
				age: 25,
				size: 1000
			}
		});
	}
}
// Initialize Firebase
var config = {
    apiKey: "AIzaSyCkgonhuBY0pYzEVle2VW-wA-pBIqghqms",
    authDomain: "train-scheduler-2a293.firebaseapp.com",
    databaseURL: "https://train-scheduler-2a293.firebaseio.com",
    projectId: "train-scheduler-2a293",
    storageBucket: "train-scheduler-2a293.appspot.com",
    messagingSenderId: "707422312591"
  };
  firebase.initializeApp(config);

var dataRef = firebase.database();

// Capture Button Click
$("#add-train").on("click", function(event) {
    event.preventDefault();

    // Code in the logic for storing and retrieving the most recent user.
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();
    
    // Object to store train data
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    };
  
    dataRef.ref().push(newTrain);

    //log added train to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    //Alert when train added
    alert("Train successfully added");

    //Clears the text boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");

    //Determine when the next train arrives
    return false;
});

// Firebase watcher + initial loader HINT: This code behaves similarly to .on("value")
dataRef.ref().on("child_added", function(childSnapshot, prevChildKey) {

        //Testing
        console.log(childSnapshot.val());

        //Store everything into a variable
        var tName = childSnapshot.val().name;
        var tDestination = childSnapshot.val().destination;
        var tFirstTrain = childSnapshot.val().firstTrain;
        var tFrequency = childSnapshot.val().frequency;

        var timeArr = tFirstTrain.split(":");
        var trainTime = moment().hours(timeArr[0]).minutes(timeArr[1]);
        var maxMoment = moment.max(moment(), trainTime);
        var tMinutes;
        var tArrival;

        //If the first train is later than the current time, set arrival to next train
        if (maxMoment === trainTime) {
            tArrival = trainTime.format("hh:mm A");
            tMinutes = trainTime.diff(moment(), "minutes");
        } else {
            //Calculate the Minutes until Arrival
            //take current time in unix and subtract from the FirstTrain time
            //find the modulus between teh difference and the frequency
            var differenceTimes = moment().diff(trainTime, "minutes");
            var tRemainder = differenceTimes % tFrequency;
            tMinutes = tFrequency - tRemainder;
            //To calculate the Arrival time, add the tMinutes to the current time
            tArrival = moment().add(tMinutes, "m").format("hh:mm A");
        }
            //Testing
            console.log("tMinutes: ", tMinutes);
            console.log("tArrival: ", tArrival);

            //Add each train's data into the table
            $("#train-table > tbody").append(
            "<tr><td>" + tName + 
            "</td><td>" + tDestination +
            "</td><td>" + tFrequency +
            "</td><td>" + tArrival +
            "</td><td>" + tMinutes +
            "</td></tr>");
        });
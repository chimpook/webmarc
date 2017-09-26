function asyncEvent1() {
    var dfd = jQuery.Deferred();

    setTimeout(function() {
        dfd.resolve( "hurray1" );
    }, Math.floor(400 + Math.random() * 4000));

    setTimeout(function() {
        dfd.reject( "sorry1" );
    }, Math.floor(400 + Math.random() * 4000));

    setTimeout(function working() {
        if (dfd.state() === "pending") {
            dfd.notify( "working1..." );
            setTimeout( working, 500 );
        }
    }, 1);

    return dfd.promise();
}

function asyncEvent2() {
    var dfd = jQuery.Deferred();

    console.log('run:2');
    dfd.resolve('ok:2');
    return dfd.promise();
}

function asyncEvent3() {
    var dfd = jQuery.Deferred();
    console.log('run:3');
    //dfd.resolve('ok:3');
    dfd.reject('fail:3');
    return dfd.promise();
}



var d = $.when(asyncEvent2(), asyncEvent3());

/*
d.always(
    function() {
        console.log('always');
        $("#container").append( "always" );
    }
);
*/

/*
d.then(
    function(status) {
        console.log('test-ok');
        $("#container").append( status );
    },
    function(status) {
        console.log('test-fail');
        $("#container").append( status );
    },
    function(status) {
        console.log('test-always');
        $("#container").append( status );
    }
);
*/

d.done(
    function(s1, s2) {
        console.log(s1, s2)
    }
);
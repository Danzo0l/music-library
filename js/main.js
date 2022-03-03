color = [
	'#2302B4',
	'#3506B9',
	'#450CCC',
	'#5813C3',
	'#6916C6',
	'#791CC9',
	'#8A11DF',
	'#9B26D1',
	'#AF2BD7',
	'#BD20DA',
	'#B821D8',
	'#CC2CD1',
	'#CD26C6',
	'#C024CC',
	'#C21DB3',
	'#C319AA',
	'#C614AF',
	'#C80F96',
	'#CB0B9F',
	'#CB0983',
	'#CC0988',
	'#DF0870',
	'#DF0865',
	'#D1086A',
	'#DF065D',
	'#D10544',
	'#D4054A',
	'#D3043F',
	'#D50434',
	'#D40328',
	'#D5011C',
	'#D70213',
]

window.onload = function() {

	const file = document.getElementById("file-input");
	const canvas = document.getElementById("canvas");
	const h3 = document.getElementById('name')
	const audio = document.getElementById("audio");

    const input = document.getElementById('background')
    const indicator = document.getElementById('indicator')
	let maxim = 0
	
	file.onchange = function() {
		const files = this.files; // FileList containing File objects selected by the user (DOM File API)
		console.log('FILES[0]: ', files[0])
		audio.src = URL.createObjectURL(files[0]); // Creates a DOMString containing the specified File object
	
		const name = files[0].name
		h3.innerText = `${name}` // Sets <h3> to the name of the file
	
		///////// <CANVAS> INITIALIZATION //////////
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		const ctx = canvas.getContext("2d");
		///////////////////////////////////////////
	
	
		const context = new AudioContext(); // (Interface) Audio-processing graph
		let src = context.createMediaElementSource(audio); // Give the audio context an audio source,
		const analyser = context.createAnalyser(); // Create an analyser for the audio context
	
		src.connect(analyser); // Connects the audio context source to the analyser
		analyser.connect(context.destination); // End destination of an audio graph in a given context
	
		analyser.fftSize = 256;
	
		const bufferLength = analyser.frequencyBinCount;

		const dataArray = new Uint8Array(bufferLength); // Converts to 8-bit unsigned integer array
		// At this point dataArray is an array with length of bufferLength but no values
		console.log('DATA-ARRAY: ', dataArray) // Check out this array of frequency values!
	
		const WIDTH = canvas.width;
		const HEIGHT = canvas.height;
		console.log('WIDTH: ', WIDTH, 'HEIGHT: ', HEIGHT)
	
		const barWidth = (WIDTH / bufferLength) * 13;
		console.log('BARWIDTH: ', barWidth)
	
		console.log('TOTAL WIDTH: ', (117*10)+(118*barWidth)) // (total space between bars)+(total width of all bars)
	
		let barHeight;
		let x = 0;
	
		function renderFrame() {
			requestAnimationFrame(renderFrame); // Takes callback function to invoke before rendering
			
			x = 0;
			
			analyser.getByteFrequencyData(dataArray); // Copies the frequency data into dataArray
			// Results in a normalized array of values between 0 and 255
			// Before this step, dataArray's values are all zeros (but with length of 8192)
			
			// ctx.fillStyle = "rgba(0,0,0,0.2)"; // Clears canvas before rendering bars (black with opacity 0.2)
			// ctx.fillRect(0, 0, WIDTH, HEIGHT); // Fade effect, set opacity to 1 for sharper rendering of bars
			
			let hex;
        	let he, intensive
			let bars = 4  // Set total number of bars you want per frame

	
			for (let i = 0; i < bars; i++) {
				barHeight = Math.floor(dataArray[i]);

				hex = color[Math.floor(barHeight/16) - 4]

				intensive = barHeight / 4

        	    he = 28


        	    let style = `linear-gradient(0deg, ${hex}${intensive} 0%, #000000 ${he}%, ${hex}09 100%)`;
        	    //let style = `radial-gradient(153.22% 113.22% at 50.07% 22.87%, rgba(255, 255, 255, 0) 0%, ${hex}56 120%)`
        	    //let style = `linear-gradient(0deg, rgba(${r},${g},${b},${intensive}) -81.05%, rgba(255, 112, 223, 0) 34.02%, rgba(255, 255, 255, 0) 88%, rgba(${r},${g},${b},${intensive/3}) 117.77%)`
        	    //let style = `radial-gradient(123.59% 71.3% at 50.07% 45.32%, rgba(255, 255, 255, 0) 5.73%, rgba(${r},${g},${b},0.07) 58.33%, rgba(${r},${g},${b},0.52) 100%)`


			    input.style.background = style;

				x += barWidth + 30
        	    lastValue = barHeight
			}
		}
	
		audio.play();
		renderFrame();
	};
	};
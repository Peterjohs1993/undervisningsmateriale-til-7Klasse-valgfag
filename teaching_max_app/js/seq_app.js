

const buttons = document.querySelectorAll('.toggle-button');


async function setup() {
    
    const patchExportURL = "export/patch.export.json";

    // Create AudioContext
    const WAContext = window.AudioContext || window.webkitAudioContext;
    const context = new WAContext();

    // Create gain node and connect it to audio output
    const outputNode = context.createGain();
    outputNode.connect(context.destination);
    
    // Fetch the exported patcher
    let response, patcher;
    try {
        response = await fetch(patchExportURL);
        patcher = await response.json();
    
        if (!window.RNBO) {
            // Load RNBO script dynamically
            // Note that you can skip this by knowing the RNBO version of your patch
            // beforehand and just include it using a <script> tag
            await loadRNBOScript(patcher.desc.meta.rnboversion);
        }

        
    } catch (err) {
        const errorContext = {
            error: err
        };
        if (response && (response.status >= 300 || response.status < 200)) {
            errorContext.header = `Couldn't load patcher export bundle`,
            errorContext.description = `Check app.js to see what file it's trying to load. Currently it's` +
            ` trying to load "${patchExportURL}". If that doesn't` + 
            ` match the name of the file you exported from RNBO, modify` + 
            ` patchExportURL in app.js.`;
        }
        if (typeof guardrails === "function") {
            guardrails(errorContext);
        } else {
            throw err;
        }
        return;
    }
    
    // (Optional) Fetch the dependencies
    let dependencies = [];
    try {
        const dependenciesResponse = await fetch("export/dependencies.json");
        dependencies = await dependenciesResponse.json();

        // Prepend "export" to any file dependenciies
        dependencies = dependencies.map(d => d.file ? Object.assign({}, d, { file: "export/" + d.file }) : d);
    } catch (e) {}

    // Create the device
    let device;
    try {
        device = await RNBO.createDevice({ context, patcher });

       
    } catch (err) {
        if (typeof guardrails === "function") {
            guardrails({ error: err });
        } else {
            throw err;
        }
        return;
    }

    // (Optional) Load the samples
    if (dependencies.length)
        await device.loadDataBufferDependencies(dependencies);

    // Connect the device to the web audio graph
    device.node.connect(outputNode);

    const inports = getInports(device);
     console.log("Inports:");
    console.log(inports);
    const parameters = getParameters(device);
    console.log("Parameters");
    parameters.forEach((param) => {
    console.log(param);
  });
  // (Optional) Extract the name and rnbo version of the patcher from the description
  
  document.body.onclick = () => {
      context.resume();
    }
    
    // Skip if you're not using guardrails.js
    if (typeof guardrails === "function")
        guardrails();
    
    setupStartStop(device);
    setupTempo(device);
    mixerCtrl(device);
    ambiSpeed(device);
    filterCtrl(device);
    drumSeq(device);
    bassSeq(device);
    env(device);
    setupMelodySliders(device);
    setupRecording(context, outputNode)

  const button1 = document.getElementById('toggle1');
  const button2 = document.getElementById('toggle2');
  const button3 = document.getElementById('toggle3');
  const button4 = document.getElementById('toggle4');
  const button5 = document.getElementById('toggle5');
  
  // Button 1 event listener
  button1.addEventListener('click', function() {
    const lyd1 = device.parametersById.get("ambience_1_Start/Stop");
      const isActive = this.classList.contains('active');
      if (!isActive) {
          this.classList.remove('inactive');
          this.classList.add('active');
          lyd1.value = 1;
      } else {
          this.classList.remove('active');
          this.classList.add('inactive');
          lyd1.value = 0;
      }
  });
  
  // Button 2 event listener
  button2.addEventListener('click', function() {
      const isActive = this.classList.contains('active');
      const lyd2 = device.parametersById.get("ambience_2_Start/Stop");

      if (!isActive) {
          this.classList.remove('inactive');
          this.classList.add('active');
          lyd2.value = 1;
      } else {
          this.classList.remove('active');
          this.classList.add('inactive');
          lyd2.value = 0;
      }
  });
  
  // Button 3 event listener
  button3.addEventListener('click', function() {
      const isActive = this.classList.contains('active');
      const loop1 = device.parametersById.get("ambience_1_loop");

      if (!isActive) {
          this.classList.remove('inactive');
          this.classList.add('active');
          loop1.value = 1;
      } else {
          this.classList.remove('active');
          this.classList.add('inactive');
          loop1.value = 0;
      }
  });
  
  // Button 4 event listener
  button4.addEventListener('click', function() {
      const isActive = this.classList.contains('active');
      const loop2 = device.parametersById.get("ambience_2_loop");

      if (!isActive) {
          this.classList.remove('inactive');
          this.classList.add('active');
          loop2.value = 1;
      } else {
          this.classList.remove('active');
          this.classList.add('inactive');
          loop2.value = 0;
      }
  });
  
const fileButton1 = document.getElementById('toggle6');
const fileButton2 = document.getElementById('toggle7');
const fileButton3 = document.getElementById('toggle8');
const fileButton4 = document.getElementById('toggle9');
const fileButton5 = document.getElementById('toggle10');


fileButton1.addEventListener('click', () => {
    // Create an invisible file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    
    // Add it to the document
    document.body.appendChild(fileInput);
    
    // Trigger the file explorer
    fileInput.click();
    
    // Handle file selection
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                // Create an ArrayBuffer from the file
                const arrayBuffer = await file.arrayBuffer();
                // Decode the audio data
                const audioBuffer = await context.decodeAudioData(arrayBuffer);
                // Now set the data buffer with the decoded audio
                await device.setDataBuffer("percLyd_1", audioBuffer);
                console.log('Audio file loaded successfully');
            } catch (error) {
                console.error('Error loading audio file:', error);
            
            device.setDataBuffer("percLyd_1", formData);
            }
            
        }
            // Clean up by removing the input
            document.body.removeChild(fileInput);
        });
    });

    fileButton3.addEventListener('click', () => {
    // Create an invisible file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    
    // Add it to the document
    document.body.appendChild(fileInput);
    
    // Trigger the file explorer
    fileInput.click();
    
    // Handle file selection
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                // Create an ArrayBuffer from the file
                const arrayBuffer = await file.arrayBuffer();
                // Decode the audio data
                const audioBuffer = await context.decodeAudioData(arrayBuffer);
                // Now set the data buffer with the decoded audio
                await device.setDataBuffer("percLyd_2", audioBuffer);
                console.log('Audio file loaded successfully');
            } catch (error) {
                console.error('Error loading audio file:', error);
            
            device.setDataBuffer("percLyd_2", 0);
            device.setDataBuffer("percLyd_2", formData);
            }
            
        }
            // Clean up by removing the input
            document.body.removeChild(fileInput);
        });
    });
    
    fileButton2.addEventListener('click', () => {
    // Create an invisible file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    
    // Add it to the document
    document.body.appendChild(fileInput);
    
    // Trigger the file explorer
    fileInput.click();
    
    // Handle file selection
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                // Create an ArrayBuffer from the file
                const arrayBuffer = await file.arrayBuffer();
                // Decode the audio data
                const audioBuffer = await context.decodeAudioData(arrayBuffer);
                // Now set the data buffer with the decoded audio
                await device.setDataBuffer("ambience_1", audioBuffer);
                console.log('Audio file loaded successfully');
            } catch (error) {
                console.error('Error loading audio file:', error);
            
            device.setDataBuffer("ambience_1", 0);
            device.setDataBuffer("ambience_1", formData);
            }
            
        }
            // Clean up by removing the input
            document.body.removeChild(fileInput);
        });
    });
    
    fileButton4.addEventListener('click', () => {
    // Create an invisible file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    
    // Add it to the document
    document.body.appendChild(fileInput);
    
    // Trigger the file explorer
    fileInput.click();
    
    // Handle file selection
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                // Create an ArrayBuffer from the file
                const arrayBuffer = await file.arrayBuffer();
                // Decode the audio data
                const audioBuffer = await context.decodeAudioData(arrayBuffer);
                // Now set the data buffer with the decoded audio
                await device.setDataBuffer("ambience_2", audioBuffer);
                console.log('Audio file loaded successfully');
            } catch (error) {
                console.error('Error loading audio file:', error);
            
            device.setDataBuffer("ambience_2", 0);
            device.setDataBuffer("ambience_2", formData);
            }
            
        }
            // Clean up by removing the input
            document.body.removeChild(fileInput);
        });
    });
    
    fileButton5.addEventListener('click', () => {
    // Create an invisible file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.style.display = 'none';
    
    // Add it to the document
    document.body.appendChild(fileInput);
    
    // Trigger the file explorer
    fileInput.click();
    
    // Handle file selection
    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                // Create an ArrayBuffer from the file
                const arrayBuffer = await file.arrayBuffer();
                // Decode the audio data
                const audioBuffer = await context.decodeAudioData(arrayBuffer);
                // Now set the data buffer with the decoded audio
                await device.setDataBuffer("percLyd_3", audioBuffer);
                console.log('Audio file loaded successfully');
            } catch (error) {
                console.error('Error loading audio file:', error);
            
            device.setDataBuffer("percLyd_3", 0);
            device.setDataBuffer("percLyd_3", formData);
            }
            
        }
            // Clean up by removing the input
            document.body.removeChild(fileInput);
        });
    });
    
}

function setupRecording(context, outputNode) {
    const recordButton = document.getElementById('toggle5');
    let mediaRecorder;
    let audioChunks = [];

    const destination = context.createMediaStreamDestination();
    outputNode.connect(destination);
    
    // Create MediaRecorder
    mediaRecorder = new MediaRecorder(destination.stream);

    mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
    };

    mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const link = document.createElement('a');
        link.href = audioUrl;
        link.download = 'recorded-audio.wav';
        link.click();
        audioChunks = [];
    };

    recordButton.addEventListener('click', () => {
        const isActive = recordButton.classList.contains('active');
        
        if (!isActive) {
            // Start recording
            audioChunks = [];
            mediaRecorder.start();
            recordButton.classList.remove('inactive');
            recordButton.classList.add('active');
        } else {
            // Stop recording
            mediaRecorder.stop();
            recordButton.classList.remove('active');
            recordButton.classList.add('inactive');
        }
    });
}

function loadRNBOScript(version) {
    return new Promise((resolve, reject) => {
        if (/^\d+\.\d+\.\d+-dev$/.test(version)) {
            throw new Error("Patcher exported with a Debug Version!\nPlease specify the correct RNBO version to use in the code.");
        }
        const el = document.createElement("script");
        el.src = "https://c74-public.nyc3.digitaloceanspaces.com/rnbo/" + encodeURIComponent(version) + "/rnbo.min.js";
        el.onload = resolve;
        el.onerror = function(err) {
            console.log(err);
            reject(new Error("Failed to load rnbo.js v" + version));
        };
        document.body.append(el);
    });
}



function loadPresets(device, patcher) {
    let presets = patcher.presets || [];
    if (presets.length < 1) {
        document.getElementById("rnbo-presets").removeChild(document.getElementById("preset-select"));
        return;
    }

    document.getElementById("rnbo-presets").removeChild(document.getElementById("no-presets-label"));
    let presetSelect = document.getElementById("preset-select");
    presets.forEach((preset, index) => {
        const option = document.createElement("option");
        option.innerText = preset.name;
        option.value = index;
        presetSelect.appendChild(option);
    });
    presetSelect.onchange = () => device.setPreset(presets[presetSelect.value].preset);
}

function setupMelodySliders(device) {
    const melodySliders = [];
    for (let i = 1; i < 17; i++) {
      const melodySlider = document.getElementById(`pitch-slider-${i}`);
      melodySliders.push(melodySlider);
  
      melodySlider.oninput = () => {
        sendMessageToInport(
          device,
          "bassline_pitch",
          melodySliders.map((s) => s.value).join(", ")
        );
      };
    }
  }

function env(device) {
    const slider1 = document.getElementById("atk");
    const slider4 = document.getElementById("rel");

    const tar1 = device.parametersById.get("bas_Attack");
    const tar4 = device.parametersById.get("bas_release");

    slider1.oninput = () => {
        tar1.value = slider1.value;
    }
    slider4.oninput = () => {
        tar4.value = slider4.value;
    }
}

function bassSeq(device) {
    const bassCtrl = document.getElementById("bass-matrix-grid");
    const VALUE_LIST = [0, 0.0625, 0.125, 0.1875, 0.25, 0.3125, 0.375, 
        0.4375, 0.5, 0.5625, 0.625, 0.6875, 0.75, 0.8125, 0.875, 0.9375];

    var bassMess;

    bassCtrl.onclick = () => {
        bassMess = window.sequencerState;
        var inportVal = [];

        var allNull = bassMess.every(value => value === 0);

        if(allNull){
            inportVal = "bang";
            return;
        }

        for(var g = 0; g < bassMess.length; g++) {
            if(bassMess[g] === 1){
                inportVal.push(VALUE_LIST[g]);
            }
            
        }

        const eventBass = new RNBO.MessageEvent(RNBO.TimeNow, "bassline_trig", inportVal);

        device.scheduleEvent(eventBass);
        console.log(inportVal);

        
    }
}

function drumSeq(device) {
    const matrixCtrl = document.getElementById("matrix-grid");
    var myCtrl;
    
    matrixCtrl.onclick = () => {
        var labels = ['Kick', 'Snare', 'Hihat'];
        
        for (let h = 0; h < 3; h++) {
            myCtrl = (window[labels[h]]);
            myMess = "sequence" + labels[h];

            const event = new RNBO.MessageEvent(RNBO.TimeNow, myMess, myCtrl);
            
            device.scheduleEvent(event);
            
            console.log(myMess + " " + myCtrl);
        }
    }
}

function filterCtrl(device){
    const cutCtrl = document.getElementById("cutCtrl");
    const resCtrl = document.getElementById("resCtrl");

    const cutOff = device.parametersById.get("filterCutoff");
    const Reson = device.parametersById.get("filterRes");

    cutCtrl.oninput = () => {
        cutOff.value = cutCtrl.value;
    }
    resCtrl.oninput = () => {
        Reson.value = resCtrl.value;
    }

}

function ambiSpeed(device){
    const pitch1 = document.getElementById("speed1");
    const pitch2 = document.getElementById("speed2");

    const speed1 = device.parametersById.get("ambience_1_Rate");
    const speed2 = device.parametersById.get("ambience_2_Rate");

    pitch1.oninput = () => {
        speed1.value = pitch1.value;
    }

    pitch2.oninput = () => {
        speed2.value = pitch2.value;
    }


}

function mixerCtrl(device){
    const fader1 = document.getElementById("kick-fader");
    const fader2 = document.getElementById("Snare-fader");
    const fader3 = document.getElementById("hihat-fader");
    const fader4 = document.getElementById("bass-fader");
    const fader5 = document.getElementById("lyd1-fader");
    const fader6 = document.getElementById("lyd2-fader");

    const lyd1Vol = device.parametersById.get("Lyd1_volumen");
    const lyd2Vol = device.parametersById.get("Lyd2_volumen");
    const lyd3Vol = device.parametersById.get("Lyd3_volumen");
    const lyd4Vol = device.parametersById.get("bas_volumen");
    const lyd5Vol = device.parametersById.get("ambience_1_volumen");
    const lyd6Vol = device.parametersById.get("ambience_2_volumen");

    fader1.value = lyd1Vol.value;
    fader2.value = lyd2Vol.value;
    fader3.value = lyd3Vol.value;
    fader4.value = lyd4Vol.value;
    fader5.value = lyd5Vol.value;
    fader6.value = lyd6Vol.value;

    fader1.oninput = () => {
        lyd1Vol.value = fader1.value;
    }
    fader2.oninput = () => {
        lyd2Vol.value = fader2.value;
    }
    fader3.oninput = () => {
        lyd3Vol.value = fader3.value;
    }
    fader4.oninput = () => {
        lyd4Vol.value = fader4.value;
    }
    fader5.oninput = () => {
        lyd5Vol.value = fader5.value;
    }
    fader6.oninput = () => {
        lyd6Vol.value = fader6.value;
    }
}
function setupTempo(device) {
    const tempoText = document.getElementById("tempo-text");
    const tempoState = device.parametersById.get("tempo");
    tempoText.value = tempoState.value;
  
    tempoText.onchange = () => {
        const newValue = parseFloat(tempoText.value);
        
        if (isNaN(newValue) || newValue < 0) {
          tempoText.value = tempoState.value;
          return;
        }
        
        if (newValue > tempoState.max) {
          tempoText.value = tempoState.max;
        } else if (newValue < tempoState.min) {
          tempoText.value = tempoState.min;
        }
        tempoState.value = parseFloat(tempoText.value);
    };
}

function setupStartStop(device) {
    const tempoToggle = document.getElementById("tempo-toggle");
    const transport = device.parametersById.get("Start/Stop_Transport")
    tempoToggle.onclick = () => {
    transport.value = tempoToggle.checked ? "1" : "0";  
    };
    const toggleState = getParameter(device, "Start/Stop_Transport");
    tempoToggle.checked = toggleState.value === 1;
    
  }


function getInports(device) {
    const messages = device.messages;
    const inports = messages.filter(
      (message) => message.type === RNBO.MessagePortType.Inport
    );
    return inports;
  }

function getParameters(device) {
    const parameters = device.parameters;
    return parameters;
  }

  function getParameter(device, parameterName) {
    const parameters = device.parameters;
    const parameter = parameters.find((param) => param.name === parameterName);
    return parameter;
  }

  function sendMessageToInport(device, inportTag, values) {
    // Turn the text into a list of numbers (RNBO messages must be numbers, not text)
    const messsageValues = values.split(/\s+/).map((s) => parseFloat(s));
  
    // Send the message event to the RNBO device
    let messageEvent = new RNBO.MessageEvent(
      RNBO.TimeNow,
      inportTag,
      messsageValues
    );
    device.scheduleEvent(messageEvent);
  }
  

  

setup();


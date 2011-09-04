/*
	Copyright (c) 2011 Oscar Godson ( http://oscargodson.com ) and Sebastian Nitu ( http://sebnitu.com )
	
	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:
	
	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.
	
	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	
	More infomation on http://oscargodson.com/labs/jkey
	or fork it at https://github.com/OscarGodson/jKey
	
	Special thanks to Macy Abbey
*/
(function($) {
	$.fn.jkey = function(keyCombo,options,callback) {

  //Check if the selected element was the window and make it document
  //We do this because IE will fail if you select window since you can't attach
  //keypresses to the window in IE
  var $this = this;
  if(!this[0].parentNode){ $this = document; }

		// Save the key codes to JSON object
		var keyCodes = { 
    /* start the a-z keys */
    'a' : 65,
    'b' : 66,
    'c' : 67,
    'd' : 68,
    'e' : 69,
    'f' : 70,
    'g' : 71,
    'h' : 72,
    'i' : 73,
    'j' : 74,
    'k' : 75,
    'l' : 76,
    'm' : 77,
    'n' : 78,
    'o' : 79,
    'p' : 80,
    'q' : 81,
    'r' : 82,
    's' : 83,
    't' : 84,
    'u' : 85,
    'v' : 86,
    'w' : 87,
    'x' : 88,
    'y' : 89,
    'z' : 90,
    /* start number keys */
    '0' : 48,
    '1' : 49,
    '2' : 50,
    '3' : 51,
    '4' : 52,
    '5' : 53,
    '6' : 54,
    '7' : 55,
    '8' : 56,
    '9' : 57,
    /* start the f keys */
    'f1' : 112,
    'f2' : 113,
    'f3' : 114,
    'f4' : 115,
    'f5' : 116,
    'f6' : 117,
    'f7' : 118,
    'f8' : 119,
    'f9' : 120,
    'f10': 121,
    'f11': 122,
    'f12': 123,
    /* start the modifier keys */
    'shift' : 16,
    'ctrl' : 17,
    'control' : 17,
    'alt' : 18,
    'option' : 18, //Mac OS key
    'opt' : 18, //Mac OS key
    'cmd' : 224, //Mac OS key
    'command' : 224, //Mac OS key
    'fn' : 255, //tested on Lenovo ThinkPad
    'function' : 255, //tested on Lenovo ThinkPad
    /* Misc. Keys */
    'backspace' : 8,
    'osxdelete' : 8, //Mac OS version of backspace
    'enter' : 13,
    'return' : 13, //Mac OS version of "enter"
    'space':32,
    'spacebar':32,
    'esc':27,
    'escape':27,
    'tab':9,
    'capslock':20,
    'capslk':20,
    'super':91,
    'windows':91,
    'insert':45,
    'delete':46, //NOT THE OS X DELETE KEY!
    'home':36,
    'end':35,
    'pgup':33,
    'pageup':33,
    'pgdn':34,
    'pagedown':34,
    /* Arrow keys */
    'left' : 37,
    'up'   : 38,
    'right': 39,
    'down' : 40,
    /* Special char keys */
    '`':96,
    '~':96,
    '-':45,
    '_':45,
    '=':187,
    '+':187,
    '[':219,
    '{':219,
    ']':221,
    '}':221,
    '\\':220, //it's actually a \ but there's two to escape the original
    '|':220,
    ';':59,
    ':':59,
    "'":222,
    '"':222,
    ',':188,
    '<':188,
    '.':190,
    '>':190,
    '/':191,
    '?':191
		};

		var x = '';
		var y = '';
		var keySplit, unbinding = false;
		if(typeof options == 'function' && typeof callback == 'undefined'){
			callback = options;
			options = false;
		} else if(keyCombo === 'unbind') { // If the unbind "method" was called on the jkey bound element
			if(typeof options === 'string') // If a key combo was given as second argument to the unbind method
				// We assign it to the keyCombo variable
				keyCombo = options;
			else
				keyCombo = '';
				
			// We are unbinding the keyCombo passed
			unbinding = true;
		}
		
		//IE has issues here... so, we "convert" toString() :(
		if(keyCombo.toString().indexOf(',') > -1){ //If multiple keys are selected (But are not a combo)
			keySplit = keyCombo.match(/[a-zA-Z0-9]+/gi);
		}
		else { //Else (if it's a single key or a combo) just store this single key
			keySplit = [keyCombo];
		}
		for(x in keySplit){ //For each key in the array...
			if(!keySplit.hasOwnProperty(x)) { continue; }
			//Same as above for the toString() and IE
			if(keySplit[x].toString().indexOf('+') > -1){
				// Key selection by user is a key combo
				// Create a combo array and split the key combo
				var combo = [];
				var comboSplit = keySplit[x].split('+');
				// Save the key codes for each element in the key combo
				for(y in comboSplit){
					combo[y] = keyCodes[ comboSplit[y] ];
				}
				keySplit[x] = combo;
			}
			else {
				//Otherwise, it's just a normal, single key command (Used to store single and multiple keys)
				keySplit[x] = keyCodes[ keySplit[x] ];
			}
		}
			
		function swapJsonKeyValues(input) {
			var one, output = {};
			for (one in input) {
				if (input.hasOwnProperty(one)) {
					output[input[one]] = one;
				}
			}
			return output;
		}
		
		function isCombo(keyCombo, keySplit) {
			return (typeof keySplit === 'object' && keySplit.length > 0 && keyCombo.indexOf('+') > -1) ? true : false;
		}
			
		var keyCodesSwitch = swapJsonKeyValues(keyCodes);
		
		return this.each(function() {
			$this = $(this);
						
			var elementKeysCallbacks, elementKeysCallbacksCount, alreadyInitialized, i;
			// Getting elements jkey_bounds $.data entry
			elementKeysCallbacks = $this.data('jkeyBounds');
			// Getting callbacks count
			elementKeysCallbacksCount = $this.data('jkeyBoundsCount');
			// We set the var that will tell us if we'll be binding the jkey events
			// on the element, depending on if it was yet bound or not
			alreadyInitialized = true;
			// If it wasn't defined before
			if(typeof elementKeysCallbacks === 'undefined' || elementKeysCallbacks === null) {
				console.log('Binding key, callbacks = ' + elementKeysCallbacks);
				// We create an empty hash_map for its keySplit
				elementKeysCallbacks = {};
				// We initialize callbacks count
				elementKeysCallbacksCount = 0;
				// And we tell that we're going to bind jkey events
				alreadyInitialized = false;
			}
			
			var index, optionsHash, keyCallback;
			
			// If we asked to unbind
			if(unbinding === true) {
				// If the keys to unbind were given
				if(typeof keySplit[0] !== 'undefined') {
					for(i = 0, keyCombosCount = keySplit.length; i < keyCombosCount; i++) {
						if(isCombo(keyCombo, keySplit[i]))
							index = keySplit[i].sort().join('+');
						else
							index = keySplit[i];
						
						// If the key we currently check doesn't exist we go to the next loop turn
						if(typeof elementKeysCallbacks[index] === 'undefined')
							continue;
						
						// If there's only one callback given to unbind
						if(typeof callback === 'function') {
							console.log('Want to unbind a callback');
							// We check every callback bound for this
							for(keyCallback in elementKeysCallbacks[index]) {
								// If the callback corresponds to the one we want to remove, we set it's container to null
								if(elementKeysCallbacks[index][keyCallback].callback === callback)
									elementKeysCallbacks[index][keyCallback] = null;
							}
							// We clean the array so we don't have empty values
							elementKeysCallbacks[index] = $.grep(elementKeysCallbacks[index], function(val) {return val;});
						}
						else { // Else we want to remove all the callbacks associated to the key/combo
							delete elementKeysCallbacks[index];
						}
					}
				} else { // We want to remove all
					console.log('Remove all callbacks !');
					elementKeysCallbacks = null;
					elementKeysCallbacksCount = 0;
					$this
						.unbind('keyup.jkey')
						.unbind('keydown.jkey');
				}
			}
			// Else, if we're not unbinding
			else {
				// For each keySplit's keyCombo passed to jKey
				for(i = 0, keyCombosCount = keySplit.length; i < keyCombosCount; i++) {
				
					// If we got an array in the keySplit entry, so we got a key combo
					if(isCombo(keyCombo, keySplit[i])) {
						// We sort the keySplit so if the combo is bound again using a different order for the
						// keys, we can find it again, and we use a join for the index in the elementKeysCallbacks hash
						index = keySplit[i].sort().join('_'); 
						optionsHash = {'callback': callback, 'options': options, 'keys': keySplit[i]};
					} else {
						index = keySplit[i];
						optionsHash = {'callback': callback, 'options': options};
					}
				
					// If the key entry doesn't exist yet in our data hash
					if(typeof elementKeysCallbacks[index] === 'undefined')
						// We create an array that will contain it with its options
						elementKeysCallbacks[index] = [];
					
					// We add the callback for the key or combo
					elementKeysCallbacks[index].push(optionsHash);
				
					// We increment our callbacks count for that keyCombo
					elementKeysCallbacksCount++;
				}
			}
			
			// We set the jkey_bounds entry to be the previous bound keys plus
			// the keys now bound at the time it's being called
			$this.data('jkeyBounds', elementKeysCallbacks);
			// We store the count too
			$this.data('jkeyBoundsCount', elementKeysCallbacksCount);
			
			//---------------------------------------------------------------------------------
			
			// If we already got our listeners
			if(alreadyInitialized)
				return $this;
			
			// Create active keys array
			// This array will store all the keys that are currently being pressed
			var activeKeys = $(document).data('activeKeys');
			// Or if there hasn't been yet, we create a new array
			if(typeof activeKeys === 'undefined')
				activeKeys = [];
			
			$this.bind('keydown.jkey',function(e){
				// Save the current key press
				activeKeys[ e.keyCode ] = e.keyCode;
				
				var callbacksArray = elementKeysCallbacks[e.keyCode];
				// If the key the user pressed is matched with any key the developer set a key code with...
				// So we shall got a callback array
				if(typeof callbacksArray === 'object' && callbacksArray.length > 0) { //and they provided a callback function
					console.log('Woot pressed !');
					for(i = 0, keyCallbacksCount = callbacksArray.length; i < keyCallbacksCount; i++) {
						callbacksArray[i].callback.call(this, keyCodesSwitch[e.keyCode]); //trigger call back and...
						if(callbacksArray[i].options === false)
							e.preventDefault(); //cancel the normal							
					}
				}
				else { // Else, the key did not match which means it's either a key combo or just doesn't exist
					// Check if the individual items in the key combo match what was pressed
					var entry, callback, comboKeys;
					for(keyEntry in elementKeysCallbacks){
						
						// Shorter label for the posible combo
						keyCallbacks = elementKeysCallbacks[keyEntry];
						
						for(callback in keyCallbacks) {
							
							entry = keyCallbacks[callback];
							
							// If the key entry we are looking at doesn't contain any .keys key
							// we directly now that it's not a combo so we continue to the next element
							if(typeof entry.keys === 'undefined')
								continue;
						
							comboKeys = entry.keys;
						
							if($.inArray(e.keyCode, comboKeys) > -1) {
								// Initiate the active variable
								var active = false;
						
								// All the individual keys in the combo with the keys that are currently being pressed
								for(y in comboKeys) {

									if($.inArray(comboKeys[y], activeKeys) > -1) {
										active = true;
									} else {
										active = false;
										break; // If a key of the combo wasn't pressed, we don't check the others, we just break the loop
									} 
								}
							
								// If all the keys in the combo are being pressed, active will equal true
								if(active === true){
								
									if(typeof entry.callback == 'function'){ //If they provided a callback function
									
										var activeString = '';
								
										for(var z in activeKeys) {
											if (activeKeys[z] != '') {
												activeString += keyCodesSwitch[ activeKeys[z] ] + '+';
											}
										}
										activeString = activeString.substring(0, activeString.length - 1);
										entry.callback.call(this, activeString ); //trigger call back and...
										if(entry.options === false){
											e.preventDefault(); //cancel the normal
										}
									}
								} // End of if(active === true)
							}
							
						} // End of for(callback in keyCallbacks)
					}
				} // end of if in array
				
				// We store currently active keys
				$(document).data('activeKeys', activeKeys);
			}).bind('keyup.jkey',function(e) {
				// Remove the current key press
				activeKeys[ e.keyCode ] = '';
				
				// We store currently active keys
				$(document).data('activeKeys', activeKeys);
			});
			
			return $this;
			
		});
	};
})(jQuery);
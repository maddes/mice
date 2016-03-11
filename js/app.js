angular.module('mice', [])

.controller('MiceController', MiceController)
.filter('toHumanTime', toHumanTime)

MiceController.$inject = ['$interval']

function MiceController ($interval) {
	// Set ViewModel
	var vm = this
	// "Database"
	vm.items = []
	// Initialize new item model
	resetNewItem()
	// Add item function
	vm.addItem = addItem
	vm.toggleItem = toggleItem
	// Run loop to update timers every second
	$interval(updateTimers, 1000);
	
	//////////////////////////////////////////
	
	// Function to toggle item and copy it's title
	function toggleItem (item, $event) {
		// Toggle running
		item.running = !item.running
		// Get title element
		element = $event.currentTarget.getElementsByTagName('strong')[0]
		// Select title content
		var range, selection
		if (document.body.createTextRange) {
			range = document.body.createTextRange();
			range.moveToElementText(element);
			range.select();
		} else if (window.getSelection) {
			selection = window.getSelection();        
			range = document.createRange();
			range.selectNodeContents(element);
			selection.removeAllRanges();
			selection.addRange(range);
		}
		// Try to copy text
		try {
			console.log('Copying text: ', document.execCommand('copy'));
		} catch (err) {
			console.log('Oops, unable to copy');
		}
	}
	
	// Function to add items to the list
	function addItem () {
		if (vm.newItem.title) {
			vm.items.push(vm.newItem)
			resetNewItem()
		}
	}
	
	// Reset the new item model
	function resetNewItem () {
		vm.newItem = {
			title: '',
			timer: 0,
			running: true
		}
	}

	// This will ran on a loop to update timers continuously
	function updateTimers () {
		vm.items.forEach(function (item) {
			if (item.running) {
				item.timer++
			}
		})
	}
}

function toHumanTime () {
	return function (timer) {
		// Data to be used
		var seconds, minutes, hours, string
		seconds = timer
		// Too many seconds, calculate minutes
		if (seconds > 59) {
			minutes = (seconds / 60) | 0
			seconds = seconds % 60
			// Too many minutes, calculate hours
			if (minutes > 59) {
				hours   = (minutes / 60 ) | 0
				minutes = minutes % 60
			}
		}
		string = seconds + 's'
		if (minutes) {
			string = minutes + 'm ' + string
		}
		if (hours) {
			string = hours   + 'h ' + string
		}
		return string
	}
}
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
		// Stop timer
		if (item.started) {
			// Add time elapsed to item timer
			item.timer += ((new Date() - item.started) / 1000) | 0
			item.started = null
		}
		// 
		else {
			item.started = new Date()
		}
		// Get title element
		element = $event.currentTarget.getElementsByTagName('strong')[0]
		// Deselect everything
		var selection = window.getSelection()
		selection.removeAllRanges();
		// Select title
		var range = document.createRange();
		range.selectNodeContents(element);
		selection.addRange(range);
		// Copy text
		document.execCommand('copy');
		// Deselect everything
		selection.removeAllRanges();
	}
	
	// Function to add items to the list
	function addItem () {
		if (vm.newItem.title) {
			vm.newItem.started = new Date()
			vm.items.push(vm.newItem)
			resetNewItem()
		}
	}
	
	// Reset the new item model
	function resetNewItem () {
		vm.newItem = {
			title: '',
			timer: 0,
			current: 0,
			started: null
		}
	}

	// This will ran on a loop to update timers continuously
	function updateTimers () {
		var newDate = new Date()
		vm.items.forEach(function (item) {
			if (item.started) {
				item.current = item.timer + (((newDate - item.started) / 1000) | 0)
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
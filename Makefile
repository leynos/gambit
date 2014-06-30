js/main.js: js/srpg.js
	browserify js/srpg.js -o js/main.js

.PHONY: clean 
clean:
	rm js/main.js

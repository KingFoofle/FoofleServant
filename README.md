# FoofleServant

![Diagram of Bot's Structure](res/Bot%20Diagram.png?raw=true "Diagram of Bot's Structure")

To support simplicity in development, the bot supports:
	* Event Handling
		1) Create a file
		2) Modules.export the following:
			* A name denoting the event
			* An execute function with the events respective parameters

	* Command Handling

		1) Create a file
		2) Modules.export the following:
			* A name denoting the command name
			* An "execute(interaction)" function

		* Button Handling
			1) Create a file
			2) Modules.export the following:
				* A name denoting the buttonId
				* An "execute(interaction)" function

		* Debug Handling
			1) Create a file
			2) Modules.export the following:
				* A name denoting the DEBUG command
				* An "execute(message)" function


export default function(text: string): string {
    //Check to make sure everything is right
    if(!text) throw new TypeError("`text` is a required arg and is missing");
    if(typeof text != "string") throw new TypeError("`text` must be a `string`");

    //Make this a string
    text = text.toString();

    //Get the first letter and get the other text
	let newText = text.slice(1, text.length);
	let oldText = text.slice(0, 1);

    //Merge them and make the first letter upper case
	let returnedText = oldText.toUpperCase() + newText;

    //Return the final text
	return `${returnedText}`;
}
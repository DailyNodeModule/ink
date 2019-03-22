const React = require("react");
const { render, Box } = require("ink");
const request = require("request-promise-native");
const TextInput = require("ink-text-input").default;

class Search extends React.Component {
    constructor() {
        super();

        this.state = {
            result: "",
            query: ""
        };
        
        // Sets the context of the event handlers to the componennt. 
        this.newQuery = this.newQuery.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    render () {
        // Simple query/result interface. Height refers to the number of lines the element will take up in the console.
        // onSubmit is called when the enter button is pressed and onChange is called after every key press.
        return (
          <Box height={2} flexDirection="column">
              <Box>
                <Box marginRight={1}>
                        enter location:
                </Box>
                <TextInput value={this.state.query} onChange={this.handleInput} onSubmit={this.newQuery} placeholder="New York City" />
              </Box>
              <Box>{this.state.result}</Box>
          </Box>   
        );
    }

    handleInput(query) {
        this.setState({ query });
    }

    // This method is called when the enter button is pressed in the text box.
    // The current temperature is parsed from the DuckDuckGo search results.
    async newQuery (query) {
        const js = await request({
            url: `https://duckduckgo.com/js/spice/forecast/${query}/en`,
            qs: {
                p: encodeURIComponent("weather "+query)
            },
            headers: {
                "user-agent": "github.com/DailyNodeModule/ink"
            }
        });

        const objRaw = js.split("/**/ typeof ddg_spice_forecast === 'function' && ddg_spice_forecast(").pop().split(");").shift();
        const obj = eval('('+ objRaw + ')');
        
        let result = "unable to obtain temperature";
        if (obj.currently && obj.currently.temperature) 
            result = obj.currently.temperature+"°";
        
        this.setState({ query, result });
    }
}

// Here we render the component to the console.
render(<Search/>);
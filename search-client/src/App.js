import React, { useRef, useState } from 'react';
import { Grid, Input, Checkbox } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import './App.css';


const placeholders = ["he greeted death...", "the ones we love...", "dark times lie ahead..."];
const temp = () => (<p className="titles">asdasdsad</p>)
const CheckArea = () => (
  <Grid celled={false} stackable={true}>
    <Grid.Row>
      <Grid.Column width={4}><Checkbox defaultChecked label={"The Sorcerer's Stone"}/></Grid.Column>
      <Grid.Column width={4}><Checkbox defaultChecked label="The Chamber of Secrets" /></Grid.Column>
      <Grid.Column width={4}><Checkbox defaultChecked label="The Prisoner of Azkaban" /></Grid.Column>
      <Grid.Column width={4}><Checkbox defaultChecked label="The Goblet of Fire" /></Grid.Column>
    </Grid.Row>
    <Grid.Row>
      <Grid.Column width={6}><Checkbox defaultChecked label="The Order of the Phoenix" /></Grid.Column>
      <Grid.Column width={5}><Checkbox defaultChecked label="The Half-Blood Prince" /></Grid.Column>
      <Grid.Column width={5}><Checkbox defaultChecked label="The Deathly Hallows" /></Grid.Column>
    </Grid.Row>
  </Grid>
);

function App() {
  let searchTerm = useRef("");
  const [loading, setLoading] = useState(false);
  const [subtitle, setSubtitle] = useState("Search the full text of your favorite books.");

  // useEffect(() => {
  //   if (searchTerm.length < 3) {
  //     console.log(searchTerm);
  //     subtitle = "Please try a longer search term.";
  //   } else {
  //     subtitle = "Search the full text of your favorite books.";
  //   }
  // });

  if (loading) {
    if (searchTerm.current.length < 3) {
      setSubtitle("Please try a longer search term.");
    } else {
      setSubtitle("Search the full text of your favorite books.");
    }
    console.log(searchTerm, loading);
    setLoading(false);
  }
  console.log(subtitle, searchTerm);
  return (
    <div className="centred">
      <div className="bg-box">
        <h1 className="header">Potter Search</h1>
        <p id="subtitle">{subtitle}</p>
        <Grid celled={false}>
          <Grid.Row>
            <Grid.Column width={2}></Grid.Column>
            <Grid.Column width={12}>
              <Input loading={loading} fluid={true} size={"large"} action={{
                icon: 'search', onClick: (event, data) => {
                  setLoading(true);
                  console.log(searchTerm);
                } }}
                onChange={(event, data) => searchTerm.current = data.value}
                placeholder='Search...' />
            </Grid.Column>
            <Grid.Column width={2}></Grid.Column>
          </Grid.Row>
        </Grid>
        <CheckArea />
      </div>
    </div>
  );
};

export default App;

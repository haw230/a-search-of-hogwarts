import React, { useRef, useState } from 'react';
import { Grid, Input, Checkbox, Button, Icon, Label } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

import './App.css';


const placeholders = ["he greeted death...", "the ones we love...", "dark times lie ahead..."];

const checked = new Map(Object.entries({
  "The Sorcerer's Stone": true,
  "The Chamber of Secrets": true,
  "The Prisoner of Azkaban": true,
  "The Goblet of Fire": true,
  "The Order of the Phoenix": true,
  "The Half-Blood Prince": true,
  "The Deathly Hallows": true,
}));


function App() {
  const CheckBoxBook = (props) => (
    <Checkbox checked={checklist.current.get(props.book)} onClick={() => update(props.book)} defaultChecked label={props.book} />
  );
  
  const update = (book) => {
    checklist.current.set(book, !checklist.current.get(book));
    console.log(checklist.current);
  }

  const checkAll = () => {
    for (let key in checklist.current) {
      checklist.current.set(key, true);
    }
  }

  const checkNone = () => {
    for (let key in checklist.current) {
      checklist.current.set(key, false);
    }
  }
  
  const searchTerm = useRef("");
  const [loading, setLoading] = useState(false);
  const [subtitle, setSubtitle] = useState("Search the full text of your favorite books.");
  const checklist = useRef(checked);

  if (loading) {
    if (searchTerm.current.length < 3) {
      setSubtitle("Please try a longer search term.");
    } else {
      setSubtitle("Search the full text of your favorite books.");
    }
    console.log(searchTerm, loading);
    setLoading(false);
  }

  console.log(checklist);
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
        <Grid celled={false} stackable={true}>
          <Grid.Row>
            <Grid.Column width={4}><CheckBoxBook book={"The Sorcerer's Stone"} /></Grid.Column>
            <Grid.Column width={4}><Checkbox onClick={() => update("The Chamber of Secrets")} defaultChecked label="The Chamber of Secrets" /></Grid.Column>
            <Grid.Column width={4}><Checkbox onClick={() => update("The Prisoner of Azkaban")} defaultChecked label="The Prisoner of Azkaban" /></Grid.Column>
            <Grid.Column width={4}><Checkbox onClick={() => update("The Goblet of Fire")} defaultChecked label="The Goblet of Fire" /></Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}><Checkbox onClick={() => update("The Order of the Phoenix")} defaultChecked label="The Order of the Phoenix" /></Grid.Column>
            <Grid.Column width={5}><Checkbox onClick={() => update("The Half-Blood Prince")} defaultChecked label="The Half-Blood Prince" /></Grid.Column>
            <Grid.Column width={5}><Checkbox onClick={() => update("The Deathly Hallows")} defaultChecked label="The Deathly Hallows" /></Grid.Column>
          </Grid.Row>
        </Grid>
        <div className="button-div">
          <Button style={{backgroundColor: 'white'}} onClick={checkAll}>
            <Icon name='plus square outline' />
            Check All
          </Button>
          <Button style={{backgroundColor: 'white'}} onClick={checkNone}>
            <Icon name='minus square outline' />
            Uncheck All
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;

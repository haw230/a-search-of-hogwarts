import React, { useRef, useState, useEffect } from 'react';
import { Grid, Input, Checkbox, Button, Icon, Card } from 'semantic-ui-react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as $ from 'jquery';

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

const getBooks = checklist => {
  let arr = [];
  for (let [key] of checklist) {
    arr.push(checklist.get(key));
  }
  return arr;
}

function App() {
  const CheckBoxBook = ({ book, rerenderChild }) => {
    // console.log(rerenderChild);
    const [temp, setTemp] = useState(1);  // trigger rerender
    return (
      <Checkbox dfsdf={rerenderChild.toString()} checked={checklist.current.get(book)} onClick={() => {
        // console.log(checklist.current.get(book));
        update(book);
        setTemp(temp + 1);
      }} label={book} />
    )
  };
  
  const update = (book) => {
    checklist.current.set(book, !checklist.current.get(book));
    // console.log(checklist.current);
  }

  const checkAll = () => {
    for (let [key] of checklist.current) {
      checklist.current.set(key, true);
    }
    setRerenderchild(1 + rerenderChild);
  }

  const checkNone = () => {
    for (let [key] of checklist.current) {
      checklist.current.set(key, false);
    }

    setRerenderchild(1 + rerenderChild);
  }
  
  const searchTerm = useRef("");
  const [loading, setLoading] = useState(false);
  let [subtitle, setSubtitle] = useState("Search the full text of your favorite books.");
  const [rerenderChild, setRerenderchild] = useState(0);
  const [page, setPage] = useState(1);  // keep track of pages
  const [result, setResult] = useState([]);
  const checklist = useRef(checked);

  useEffect(() => {
    setSubtitle(subtitle);
  }, [subtitle]);

  if (loading) {
    let books = getBooks(checklist.current);
    let search = searchTerm.current;

    if (books.every(book => book === false)) {
      setSubtitle("Please select at least one book.");
      setLoading(false);
      return;
    }
    if (searchTerm.current.length < 3) {
      setSubtitle("Please try a longer search term.");
      setLoading(false);
      return;
    }

    if (subtitle !== "Search the full text of your favorite books.") {
      setSubtitle("Search the full text of your favorite books.");
    }

    axios.post('http://localhost:1332/api/search', {
      data: {
        books,  // checked books
        search,  // words to search for
        page,  // pagination
      }
    }).then((response) => {
      setLoading(false);
      setResult(response.data.found);
      setPage(page + 1);
      $([document.documentElement, document.body]).animate({
        scrollTop: $("#search-chunk").offset().top
      }, 1000);
    })
      .catch(err => {
        setSubtitle("Error!!!");
        console.log(err);
        setLoading(false);
      });
  }
  // console.log(checklist);
  // console.log(subtitle, searchTerm);
  console.log(result);

  return (
    <React.Fragment>
      <div id="bg-image">
        <div className="centred bg-box">
            <h1 className="header">Potter Search</h1>
            <p id="subtitle">{subtitle}</p>
            <Grid celled={false}>
              <Grid.Row>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={12}>
                  <Input loading={loading} fluid={true} size={"large"} action={loading ? {} : 
                  {
                    icon: 'search', onClick: (event, data) => {
                      setLoading(true);
                      if (page !== 1) {
                        setPage(1);
                      }
                    }
                  }
                  }
                    onChange={(event, data) => searchTerm.current = data.value}
                    placeholder='Search...' />
                </Grid.Column>
                <Grid.Column width={2}></Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid celled={false} stackable={true}>
              <Grid.Row>
                <Grid.Column width={4}>
                  <CheckBoxBook book={"The Sorcerer's Stone"} rerenderChild={rerenderChild} />
                </Grid.Column>
                <Grid.Column width={4}>
                  <CheckBoxBook book={"The Chamber of Secrets"} rerenderChild={rerenderChild} />
                </Grid.Column>
                <Grid.Column width={4}>
                  <CheckBoxBook book={"The Prisoner of Azkaban"} rerenderChild={rerenderChild} />
                </Grid.Column>
                <Grid.Column width={4}>
                  <CheckBoxBook book={"The Goblet of Fire"} rerenderChild={rerenderChild} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={6}>
                  <CheckBoxBook book={"The Order of the Phoenix"} rerenderChild={rerenderChild} />
                </Grid.Column>
                <Grid.Column width={5}>
                  <CheckBoxBook book={"The Half-Blood Prince"} rerenderChild={rerenderChild} />
                </Grid.Column>
                <Grid.Column width={5}>
                  <CheckBoxBook book={"The Deathly Hallows"} rerenderChild={rerenderChild} />
                </Grid.Column>
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
      <div>
        {result.length > 0 ? (
          <div className="results">
            <InfiniteScroll
              dataLength={result.length}
              next={() => {
                console.log(1234);
                let books = getBooks(checklist.current);
                let search = searchTerm.current;
                axios.post('http://localhost:1332/api/search', {
                  data: {
                    books,  // checked books
                    search,  // words to search for
                    page,  // pagination
                  }
                }).then((response) => {
                  // setLoading(false);
                  setResult(result.concat(response.data.found));
                  setPage(page + 1);
                })
              }}
              loader={<h4>Loading...</h4>}
              endMessage={
                <p style={{ textAlign: 'center' }}>
                  <b>Yay! You have seen it all</b>
                </p>
              }
              hasMore={true}
            >
              <div id="search-chunk"></div>
              {result.map(paragraph => (
                <Grid celled={false}>
                  <Grid.Row>
                    <Grid.Column width={2}></Grid.Column>
                    <Grid.Column width={12}>
                      {/* <Card
                        fluid
                        color="grey"
                        centered
                        header={paragraph.book}
                        description={paragraph.text}
                      >
                        </Card> */}
                      
                      <Card centered fluid>
                        <Card.Content>
                          <Card.Header>{paragraph.book}</Card.Header>
                          <Card.Description>
                            {paragraph.text.split('\n').map(chunk => (
                              <React.Fragment><div>{chunk}</div><br></br></React.Fragment>
                              
                            ))}
                          </Card.Description>
                        </Card.Content>
                      </Card>
                      
                    </Grid.Column>
                    <Grid.Column width={2}></Grid.Column>
                  </Grid.Row>
                </Grid>
              ))}
            </InfiniteScroll>
          </div>
        )
      : null}
    </div>
    </React.Fragment>
  );
};

export default App;

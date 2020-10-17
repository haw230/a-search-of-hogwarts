import React, { useRef, useState, useEffect } from 'react';
import { Grid, Input, Checkbox, Button, Icon, Card, Modal, Header } from 'semantic-ui-react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as $ from 'jquery';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

const placeholders = ["he greeted death...", "always...", "uranus...", "what is right...", "nitwit...", "expelliarmus...", "lumos..."];

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
    const [temp, setTemp] = useState(1);  // trigger rerender
    return (
      <Checkbox dfsdf={rerenderChild.toString()} checked={checklist.current.get(book)} onClick={() => {
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
  const [open, setOpen] = useState(false)
  const [occurence_loading, setOccurenceLoading] = useState(false)
  const [occurence_data, setOccurenceData] = useState({occurences: [], search: ""});
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

    if (setOccurenceLoading) {
      axios.post('https://stephanwu.tech/api/count', {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        data: {
          search,  // words to search for
        }
      }).then((response) => {
        setOccurenceLoading(false);
        setOccurenceData(response.data);
      })
        .catch(err => {
          setSubtitle("Error for Occurences");
          console.log(err);
          setLoading(false);
        });
    }

    axios.post('https://stephanwu.tech/api/search', {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
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
      .catch(error => {
        // setSubtitle("Error!!!");
        if (error.response) {
          // Request made and server responded
          setSubtitle(JSON.stringify(error.response.data));
          // setSubtitle(JSON.stringify(error.response.status));
          // setSubtitle(JSON.stringify(error.response.headers));
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request)
          setSubtitle(JSON.stringify(error.request));
        } else {
          // Something happened in setting up the request that triggered an Error
          setSubtitle(JSON.stringify('Error', error.message));
        }
        setLoading(false);
      });
  }
  // console.log(checklist);
  // console.log(subtitle, searchTerm);

  return (
    <React.Fragment>
      <p>Search the full text of your favorite Harry Potter books.</p>
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
                      setOccurenceLoading(true);
                      if (page !== 1) {
                        setPage(1);
                      }
                    }
                  }
                }
                  onChange={(event, data) => {
                    searchTerm.current = data.value
                  }}
                  onKeyPress={event => {
                    if (event.key !== 'Enter') {
                      return;
                    }
                    setLoading(true);
                    setOccurenceLoading(true);
                    if (page !== 1) {
                      setPage(1);
                    }
                  }}
                  placeholder={placeholders[Math.floor(Math.random() * placeholders.length)]} />
                </Grid.Column>
                <Grid.Column width={2}></Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid className="grid-thing" celled={false} stackable={true}>
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
              <Button className="those-buttons" style={{backgroundColor: 'white'}} onClick={checkAll}>
                <Icon name='plus square outline' />
                Check All
              </Button>
              <Button className="those-buttons" style={{backgroundColor: 'white'}} onClick={checkNone}>
                <Icon name='minus square outline' />
                Uncheck All
              </Button>
            </div>
        </div>
      </div>
      <div>
        {result.length > 0 ? (
          <div className="results">
            <div id="search-chunk"></div>
            <InfiniteScroll
              style={{z_index: -10, overflow: "visible"}}
              dataLength={result.length}
              next={() => {
                let books = getBooks(checklist.current);
                let search = searchTerm.current;
                axios.post('https://stephanwu.tech/api/search', {
                  header: {
                    "Access-Control-Allow-Origin": "*",
                  },
                  data: {
                    books,  // checked books
                    search,  // words to search for
                    page,  // pagination
                  }
                }).then((response) => {
                  setResult(result.concat(response.data.found));
                  setPage(page + 1);
                })
              }}
              loader={<h4>Loading...</h4>}

              hasMore={result[result.length - 1].book !== "No Occurences Found" && result[result.length - 1].book !== "No More Occurences Found" && result[result.length - 1].book !== "Try a more specific search!"}
            >
              <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={<div>
                  <Grid>
                    <Grid.Column textAlign="center">
                      <Button className="centred" style={{backgroundColor: 'white'}}  loading={occurence_loading}>
                      <Icon name='list alternate' /> Show All Occurences 

                      </Button>
                    </Grid.Column>
                  </Grid>
                </div>}
              >
                <Modal.Content>
                  <Modal.Description>
                    <Header>All Occurences By Book (Search Term: "{occurence_data.search}")</Header>
                    {occurence_data.occurences.map(book => (
                      <p><b>{Object.keys(book)[0]}:</b> {Object.values(book)[0]}</p>
                    ))}
                  </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                  <Button color='black' onClick={() => setOpen(false)}>
                    Exit
                  </Button>
                </Modal.Actions>
              </Modal>
              {result.map(paragraph => (
                <Grid celled={false}>
                  <Grid.Row>
                    <Grid.Column width={2}></Grid.Column>
                    <Grid.Column width={12}>
                      <Card centered fluid>
                        <Card.Content>
                          <Card.Header>{paragraph.book}</Card.Header>
                          <Card.Description>
                            {paragraph.text.split('\n').map(chunk => (
                              <React.Fragment><div dangerouslySetInnerHTML={{ __html: chunk }} /><br></br></React.Fragment>
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

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Grid, Input, Checkbox, Button, Icon, Card, Modal, Header, Message, MenuItem, Menu, Segment } from 'semantic-ui-react';
import axios from 'axios';
import InfiniteScroll from 'react-infinite-scroll-component';
import * as $ from 'jquery';

import 'semantic-ui-css/components/grid.min.css';
import 'semantic-ui-css/components/reset.min.css';
import 'semantic-ui-css/components/input.min.css';
import 'semantic-ui-css/components/site.min.css';
import 'semantic-ui-css/components/checkbox.min.css';
import 'semantic-ui-css/components/button.min.css';
import 'semantic-ui-css/components/icon.min.css';
import 'semantic-ui-css/components/card.min.css';
import 'semantic-ui-css/components/dimmer.min.css';
import 'semantic-ui-css/components/transition.min.css';
import 'semantic-ui-css/components/modal.min.css';
import 'semantic-ui-css/components/header.min.css';
import 'semantic-ui-css/components/message.min.css';
import 'semantic-ui-css/components/menu.min.css';
import 'semantic-ui-css/components/segment.min.css';

import './App.css';

const placeholders = ["he greeted death...", "always...", "uranus...", "what is right...", "nitwit...", "expelliarmus...", "lumos..."];
const API = "https://1100h19.pythonanywhere.com"
const checked = new Map(Object.entries({
  "The Philosopher's Stone": true,
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
let page = 1;

function App() {
  const CheckBoxBook = ({ book, rerenderChild }) => {
    const [temp, setTemp] = useState(1);  // trigger rerender
    return (
      <Checkbox label={book} aria-label={book} checked={checklist.current.get(book)} onClick={() => {
        update(book);
        setTemp(temp + 1);
      }} />
    )
  };
  
  const update = (book) => {
    checklist.current.set(book, !checklist.current.get(book));
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
  
  const [searchTerm, setSearchTerm] = useState("");
  
  const [loading, setLoading] = useState(false);
  let [subtitle, setSubtitle] = useState("Search the full text of JK Rowling's Harry Potter books.");
  const [rerenderChild, setRerenderchild] = useState(0);
  const [result, setResult] = useState([]);
  const [open, setOpen] = useState(false);
  const [occurence_loading, setOccurenceLoading] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [occurence_data, setOccurenceData] = useState({occurences: [], search: ""});
  const checklist = useRef(checked);
  console.log(open);
  useEffect(() => {
    setSubtitle(subtitle);
  }, [subtitle]);

  const submit = useCallback((s = '', p = null) => {
    let books = getBooks(checklist.current);
    let search = s || searchTerm;
    if ('URLSearchParams' in window) {
      const url = new URL(window.location);
      url.searchParams.set('search', search);
      window.history.pushState(null, '', url.toString());
    }

    if (books.every(book => book === false)) {
      setSubtitle("Please select at least one book.");
      setLoading(false);
      return;
    }
    if (search.length < 3) {
      setSubtitle("Please try a longer search term.");
      setLoading(false);
      return;
    }

    if (subtitle !== "Search the full text of the Harry Potter books.") {
      setSubtitle("Search the full text of the Harry Potter books.");
    }

    if (setOccurenceLoading) {
      axios.post(`${API}/api/count`, {
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
    if (p !== null) {
      page = p;
    }
    axios.post(`${API}/api/search`, {
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
      page += 1;
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
  }, [searchTerm, subtitle]);
  useEffect(() => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    if (params.get('search') !== null) {
      setSearchTerm(params.get('search'));
      setLoading(true);
      setOccurenceLoading(true);
      submit(params.get('search'));
    }
  }, [submit]);

  return (
    <React.Fragment>
      <p>Search the full text of all the Harry Potter books by J.K. Rowling.</p>
      <div id="bg-image" aria-label="Harry Potter search background image">
      <Segment inverted>
        <Menu inverted>
          <MenuItem
              name='home'
              href='https://wwww.potter-search.com'
          />
          <MenuItem
              name='blog'
              href='/blog/index.html'
              target='_blank'
            />
          <MenuItem
            name='Official Discord'
            href='https://discord.gg/Cm58qYrX'
            target='_blank'
          />
        </Menu>
      </Segment>
        <div className="centred bg-box">
            <h1 className="header">Potter Search</h1>
            <p id="subtitle">{subtitle}<br/>Please help support Potter Search on <a href="https://www.patreon.com/potter_search">Patreon</a> or <a href="https://www.buymeacoffee.com/pottersearch">Buy Me a Coffee</a>!</p>
            <Grid celled={false}>
              <Grid.Row>
                <Grid.Column width={2}></Grid.Column>
                <Grid.Column width={12}>
                <Input aria-label={"Search"} loading={loading} fluid={true} size={"large"} action={loading ? {} :
                  {
                    icon: 'search', onClick: (event, data) => {
                      setLoading(true);
                      setOccurenceLoading(true);
                      submit('', 0);
                    }
                  }
                }
                  onChange={(event, data) => {
                    setSearchTerm(data.value);
                  }}
                  value={searchTerm}
                  onKeyPress={event => {
                    if (event.key !== 'Enter') {
                      return;
                    }
                    setLoading(true);
                    setOccurenceLoading(true);
                    submit('', 0);
                  }}
                  placeholder={placeholders[Math.floor(Math.random() * placeholders.length)]} />
                </Grid.Column>
                <Grid.Column width={2}></Grid.Column>
              </Grid.Row>
            </Grid>
            <Grid className="grid-thing" celled={false} stackable={true}>
              <Grid.Row>
                <Grid.Column width={4}>
                  <CheckBoxBook book={"The Philosopher's Stone"} rerenderChild={rerenderChild} />
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
              <Button arial-label="Check All" className="those-buttons" style={{backgroundColor: 'white'}} onClick={checkAll}>
                <Icon name='plus square outline' />
                Check All
              </Button>
              <Button arial-label="Ucheck All" className="those-buttons" style={{backgroundColor: 'white'}} onClick={checkNone}>
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
            <div style={{paddingBottom: '20px'}} >
              <Button
                arial-label="Share Search"
                className="centred"
                style={{ backgroundColor: 'white' }}
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setShowCopied(true);
                  setTimeout(() => setShowCopied(false), 3000);
                }}>
                  <Icon name='share alternate' />
                    Share Search
              </Button>
              <Message color='green' hidden={!showCopied}>Copied to clipboard!</Message>
            </div>
            <InfiniteScroll
              style={{z_index: -10, overflow: "visible"}}
              dataLength={result.length}
              next={() => {
                let books = getBooks(checklist.current);
                let search = searchTerm;
                axios.post(`${API}/api/search`, {
                  header: {
                    "Access-Control-Allow-Origin": "*",
                  },
                  data: {
                    books,  // checked books
                    search,  // words to search for
                    page: page + 1,  // + 1 because page 0 is already loaded
                  }
                }).then((response) => {
                  setResult(result.concat(response.data.found));
                  page += 1;
                  console.log(page);
                })
              }}
              loader={<h4>Loading...</h4>}

              hasMore={result[result.length - 1].book !== "No Occurences Found" && result[result.length - 1].book !== "No More Occurences Found" && result[result.length - 1].book !== "Try a more specific search!"}
            >
              <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                trigger={
                  <Grid>
                    <Grid.Column textAlign="center">
                      <Button arial-label="Show All Occurrences" className="centred" style={{backgroundColor: 'white'}}  loading={occurence_loading}>
                      <Icon name='list alternate' />
                        Show All Occurrences 
                      </Button>
                    </Grid.Column>
                  </Grid>}
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
                  <Button arial-label="Exit" color='black' onClick={() => setOpen(false)}>
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

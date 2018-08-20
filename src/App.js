import React, { Component } from 'react';
import axios from 'axios';
import styled, { css } from 'styled-components';
import he from 'he';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import config from './config';

dayjs.extend( relativeTime );

const Wrapper = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  font-size: 1rem;
  text-align: center;
  color: #CD6702;
  margin: 20px 0;
`;

const DealList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Deal = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #CCC;
  border-top: 1px solid #CCC;
  padding: 20px 10px 10px;
  text-align: left;
`;

const DealTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: bold;
  margin: 0 0 10px;
  text-align: center;
`;

const DealDate = styled.small`
  display: block;
  margin-bottom: 20px;
  text-align: center;
  color: grey;
  font-size: 0.9rem;
`

const DealDescription = styled.div`
  display: flex;
  flex-direction: column;
`;

const Link = styled.a`
  text-decoration: none;
`;

const DealButton = styled.button`
  padding: 10px 15px;
  background-color: #CD6702;
  color: #FFF;
  display: block;
  margin: 10px auto;
  cursor: pointer;
`;

const StatusText = styled.p`
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;

  ${props => props.error && css`
    color: red;
  `}
`;

class App extends Component {
  state = {
    fetching: false,
    error: null,
    latestDeals: [],
  }

  componentDidMount() {
    this.fetchLatestDeals();
  }

  async fetchLatestDeals() {
    this.setState({
      fetching: true,
      error: null,
    });

    try {
      const { data } = await axios( `${config.apiUrl}/latest-deals` );

      this.setState({ latestDeals: data });
    }
    catch ( error ) {
      console.warn({ error });

      this.setState({ error });
    }
    finally {
      this.setState({ fetching: false });
    }
  }

  render() {
    const { fetching, error, latestDeals } = this.state;

    return (
      <div>
        {fetching ? (
          <Wrapper>
            <StatusText>
              Fetching...
            </StatusText>
          </Wrapper>
        ) : error ? (
          <Wrapper>
            <StatusText error>
              Uh oh! An error occurred fetching the deals.
            </StatusText>
          </Wrapper>
        ) : latestDeals.length > 0 ? (
          <DealList>
            <Title>
              Latest Deals
            </Title>

            {latestDeals.map( deal => (
              <Deal key={deal.guid}>
                <DealTitle>
                  {deal.title.split( /(\$\d+(,\d{3})*(\.\d*)?)/g ).map( str => {
                    /* TODO: Fix bug showing decimal places after money */
                    if ( str && str.startsWith( '$' ))
                      return <em class="money">{str}</em>;

                    return str && he.decode( String( str ));
                  })}
                </DealTitle>

                <DealDate>
                  {dayjs( deal.pubDate ).fromNow()}
                </DealDate>

                <DealDescription
                  dangerouslySetInnerHTML={{
                    __html: deal.description && he.decode( String( deal.description )),
                  }}
                />

                <Link
                  href={deal.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <DealButton>
                    Visit deal
                  </DealButton>
                </Link>
              </Deal>
            ))}
          </DealList>
        ) : (
          <Wrapper>
            <StatusText>
              No deals to show.
            </StatusText>
          </Wrapper>
        )}
      </div>
    );
  }
}

export default App;

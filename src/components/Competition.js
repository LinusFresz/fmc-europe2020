import React from 'react'
import styled from 'styled-components'
import { Link } from 'gatsby'
import { Icon } from 'semantic-ui-react'

const CompetitionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;

  padding: 0.5em;
`

const MainDivider = styled.hr`
  border: 0;
  margin: 1.35em auto;
  width: 100%;
  background-position: 50%;
  box-sizing: border-box;

  height: 1px;
  color: var(--green);
  background-image: linear-gradient(
    90deg,
    rgba(255, 0, 0, 0),
    var(--green) 50%,
    rgba(255, 0, 0, 0) 100%
  );
`

const Infos = styled.div`
  display: flex;
  flex-direction: column;

  width: 60vw;
  padding-left: 1em;

  div {
    margin: 0.5em 0;
  }

  span:first-child {
    font-weight: 500;
  }

  a {
    align-self: center;
  }

  @media only screen and (max-width: 768px) {
    width: 90vw;
  }
`

const ContentWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1em;

  @media only screen and (max-width: 768px) {
    flex-direction: column;
  }
`

const CompetitorsWrapper = styled(ContentWrapper)`
  flex-direction: column;
  align-items: flex-start;

  width: 60vw;

  ul {
    margin-top: 0.5em;
    font-size: 1.1rem;
    padding-left: 1em;
  }
`

export default class Competition extends React.Component {
  render() {
    const {
      id,
      city,
      country,
      delegate,
      email,
      info,
      address,
      fee,
      timezone,
      lat,
      lng,
    } = this.props
    const mapsURL = 'https://www.google.com/maps/search/?api=1&query='

    let localCompetitors = this.props.localCompetitors
    localCompetitors.sort((a, b) =>
      a.node.name > b.node.name ? 1 : b.node.name > a.node.name ? -1 : 0
    )

    return (
      <CompetitionWrapper id={id}>
        <div>
          <a href={mapsURL + lat + ',' + lng}>
            <h3 id={city.replace(/[^A-Z0-9]/gi, '')}>
              <Icon inverted name="home" size="large" />
              {city + ', ' + country}
            </h3>
          </a>
        </div>
        <ContentWrapper>
          <Infos>
            <div>
              <span>
                <strong>Address: </strong>
              </span>
              <span>
                <a href={mapsURL + lat + ',' + lng}>{address}</a>
              </span>
            </div>
            <div>
              <span>
                <strong>Delegate: </strong>
              </span>
              <span>{delegate}</span>
            </div>
            <div>
              <span>
                <strong>Fee: </strong>
              </span>
              <span>{fee}</span>
            </div>
            <div>
              <span>
                <strong>Timezone: </strong>
              </span>
              <span>{timezone}</span>
            </div>
            <Link to="/#AboutSection">
              <button className="btn">How to Register</button>
            </Link>
          </Infos>
        </ContentWrapper>
        <ContentWrapper>
          <CompetitorsWrapper>
            <h4>Registered Competitors</h4>
            <ul>
              {localCompetitors.map(competitor => (
                <li key={competitor.node.name}>{competitor.node.name}</li>
              ))}
              {localCompetitors.length <= 0 && (
                <div>No competitors registered.</div>
              )}
            </ul>
          </CompetitorsWrapper>
        </ContentWrapper>
        <MainDivider />
      </CompetitionWrapper>
    )
  }
}

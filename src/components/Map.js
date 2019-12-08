import React, { Component } from 'react'
import GoogleMapReact from 'google-map-react'
import ReactMapGL, { Marker, Popup } from 'react-map-gl';
import styled from 'styled-components'
import geolib from 'geolib'

import LocationPin from './LocationPin';

import CompetitionPreview from './CompettionPreview'
import 'mapbox-gl/dist/mapbox-gl.css';

const MapWrapper = styled.div`
  display: flex;
  justify-content: center;

  // padding: 1rem 1rem 1rem 1rem;

  @media only screen and (max-width: 768px) {
    align-items: center;
    padding: 0.5rem;
    flex-direction: column;
  }
`
const MapElement = styled.div`
  width: 45vw;
  overflow: hidden;

  @media only screen and (max-width: 768px) {
    width: 90vw;
  }
`

class OverviewMap extends Component {
  state = {
    center: {
      lat: 50.85045,
      lng: 4.34878,
    },
    zoom: 3,
    loading: true,
    markers: this.props.markers,
    selectedLocation: {},
    hoveredLocation: {},
    located: false,
    viewport: {
      longitude: 4.34878,
      latitude: 50.85045,
      zoom: 5,
    },
    mounted: false
  }

  componentDidMount() {
    this.setState({ mounted: true })
  }

  onViewportChange = viewport => {
    this.setState({ viewport })
  }

  onClickLocation = marker => {
    this.setState({ selectedLocation: marker })
  }




  findClosestLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords
        const { markers } = this.state

        let locationArray = []
        for (let i in markers) {
          let location = {
            latitude: markers[i].node.lat,
            longitude: markers[i].node.lng,
          }

          locationArray.push(location)
        }

        let sortedLocations = geolib.orderByDistance(
          { latitude: latitude, longitude: longitude },
          locationArray
        )

        let nearestCompetitionKey = sortedLocations[0].key

        this.setState({
          viewport: { latitude: latitude, longitude: longitude, zoom: 8 },
          selectedLocation: markers[nearestCompetitionKey].node,
        })
      })
    }
  }

  render() {
    const { mounted, markers, viewport } = this.state
    const mapBoxKey = process.env.GATSBY_MAPBOX_ACCESS_TOKEN

    return (
      // Important! Always set the container height explicitly
      <MapWrapper style={{ position: 'relative' }}>
        {
          <MapElement>
            <ReactMapGL
              mapboxApiAccessToken={mapBoxKey}
              mapStyle="mapbox://styles/lauraohrndorf/ck3vnh3al43iy1cnzxjc6vgn6"
              {...viewport}
              onViewportChange={(viewport) => {
                if (mounted) { this.onViewportChange(viewport) }
              }}
              width="100%"
              height="400px"
            >
              {markers.map(({ node: marker }) => (
                <Marker key={marker.id} latitude={parseFloat(marker.lat)} longitude={parseFloat(marker.lng)}>
                  <LocationPin onClick={() => this.onClickLocation(marker)} />
                </Marker>
              ))}
            </ReactMapGL>
          </MapElement>
        }
        <CompetitionPreview
          {...this.state.selectedLocation}
          findClosestLocation={this.findClosestLocation.bind(this)}
        />
      </MapWrapper >
    )
  }
}

export default OverviewMap

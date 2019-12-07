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

  padding: 1rem 1rem 1rem 1rem;

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
  }


  _onChildClick = (key, childProps) => {
    this.setState({
      selectedLocation: childProps,
    })
  }

  _onChildMouseEnter = (key, childProps) => {
    this.setState({
      hoveredLocation: childProps,
    })
  }

  _onGoogleApiLoaded = () => {
    this.setState({ loading: false })
  }

  onViewportChange = viewport => {
    this.setState({ viewport })
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
          zoom: 5,
          selectedLocation: markers[nearestCompetitionKey].node,
        })
      })
    }
  }

  render() {
    const { center, loading, markers, zoom } = this.state
    const mapBoxKey = process.env.MAPBOX_ACCESS_TOKEN
    const { viewport } = this.state;

    return (
      // Important! Always set the container height explicitly
      <MapWrapper style={{ position: 'relative' }}>
        {
          <MapElement>
            <ReactMapGL
              mapboxApiAccessToken={mapBoxKey}
              mapStyle="mapbox://styles/lauraohrndorf/ck3vnh3al43iy1cnzxjc6vgn6"
              {...viewport}
              onViewportChange={this.onViewportChange}
              width="100%"
              height="400px"
            >
              {markers.map(({ node: marker }) => (
                <Marker key={marker.id} latitude={parseFloat(marker.lat)} longitude={parseFloat(marker.lng)}>
                  <LocationPin onClick={() => this.setState({
                    selectedLocation: marker,
                  })} />
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

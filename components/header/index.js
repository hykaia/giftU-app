import React, { Component } from 'react'
import Styles from './styles'

import {
	View,
	Text,
} from 'react-native'

class header extends Component {
	render() {
		return (
			<View style={Styles.container}>
				<Text>header</Text>
			</View>
		)
	}
}

export default header
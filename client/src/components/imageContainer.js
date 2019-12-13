import React from "react"
import PropTypes from "prop-types"

const Image = (props) => (
	<img
		width={props.width}
		height={props.height}
		src={require(`../../public/img/${props.src}`)}
		className={props.className && props.className}
		id={props.id}
		alt={props.alt}
	/>
)
export default Image

Image.propTypes = {
	src: PropTypes.string,
	width: PropTypes.string,
	height: PropTypes.string,
	className: PropTypes.string,
	alt: PropTypes.string,
}

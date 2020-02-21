import PropTypes from 'prop-types';
import React from 'react'
import { cardsRef } from '../firebase'
import TextareaAutosize from 'react-autosize-textarea';
import EditCardModal from './EditCardModal';

class Card extends React.Component {
	state = {
		modalOpen: false,
	}

	deleteCard = async e => {
		try {
			e.preventDefault()
			const cardId = this.props.data.id
			const card = await cardsRef.doc(cardId)
			card.delete()
		} catch (error) {
			console.error('Error deleting card: ', error)
		}
	}

	toggleModal = () => {
		this.setState({ modalOpen: !this.state.modalOpen })
	}
	render() {
		return (
			<React.Fragment>
				<div className="card" >
					<div className="card-labels">
						{this.props.data.labels.map((label) => {
							return <span key={label} style={{ background: label }} className="label"></span>
						})
						}
					</div>
					<div className="card-body">
						<TextareaAutosize
							onClick={this.toggleModal}
							readOnly
							value={this.props.data.text}
						></TextareaAutosize>
						<span onClick={this.deleteCard}>&times;</span>
					</div>
				</div >
				<EditCardModal
					modalOpen={this.state.modalOpen}
					toggleModal={this.toggleModal}
					cardData={this.props.data}
				/>
			</React.Fragment>

		)
	}
}

Card.propTypes = {
	data: PropTypes.object.isRequired,
}
export default Card

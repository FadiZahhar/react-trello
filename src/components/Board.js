import React from 'react'
import List from './List'
import { boardsRef, listsRef } from '../firebase'
import PropTypes from 'prop-types';
import { AuthConsumer } from './AuthContext'

class Board extends React.Component {
	state = {
		currentBoard: {},
		currentLists: [],
		message: '',
	}

	componentDidMount() {
		this.getBoard(this.props.match.params.boardId)
		this.getLists(this.props.match.params.boardId)
	}

	getBoard = async (boardId) => {
		try {
			await boardsRef.doc(boardId)
				.onSnapshot(snapshot => {
					if (snapshot.exists) {
						const board = snapshot.data().board
						this.setState({ currentBoard: board })
					}
					else {
						this.setState({
							message: this.state.message = 'Board not found...',
						})
					}
				})
		} catch (error) {
			console.log('Error getting boards', error)
		}
	}

	async getLists(boardId) {
		try {
			await listsRef
				.where('list.board', '==', boardId)
				.orderBy('list.createdAt')
				.onSnapshot(snapshot => {
					snapshot.docChanges().forEach(change => {
						if (change.type === 'added') {
							const doc = change.doc
							const list = {
								id: doc.id,
								title: doc.data().list.title,
							}
							this.setState({
								currentLists: [...this.state.currentLists, list],
							})
						}
						if (change.type === 'removed') {
							this.setState({
								currentLists: [
									...this.state.currentLists.filter(list => {
										return list.id !== change.doc.id
									}),
								],
							})
						}
					})

				})
		} catch (error) {
			console.error('Error fetching lists: ', error)
		}
	}

	deleteBoard = async () => {
		const boardId = this.props.match.params.boardId
		this.props.deleteBoard(boardId)
		this.setState({
			message: this.state.message = 'Board not found...',
		})
	}

	addBoardInput = React.createRef()
	createNewList = async (e, userId) => {
		try {
			e.preventDefault()
			const list = {
				title: this.addBoardInput.current.value,
				board: this.props.match.params.boardId,
				createdAt: new Date(),
				user: userId
			}
			if (list.title && list.board && list.user) {
				await listsRef.add({ list })
			}
			this.addBoardInput.current.value = ''

		} catch (error) {
			console.error('Error creating new list: ', error)
		}
	}

	updateBoard = e => {
		const boardId = this.props.match.params.boardId
		const newTitle = e.currentTarget.value
		if (boardId && newTitle) {
			this.updateBoard(boardId, newTitle)
		}
	}

	render() {
		return (
			<AuthConsumer>
				{({ user }) => (
					<React.Fragment>
						{
							user.id === this.state.currentBoard.user ? (
								<div
									className="board-wrapper"
									style={{ backgroundColor: this.state.currentBoard.background }}
								>
									{this.state.message === '' ? (
										<div className="board-header">
											<input
												type="text"
												name="boardTitle"
												onChange={this.updateBoard}
												// default rather than value, specifies the initial value but leave subsequent updates uncontrolled
												defaultValue={this.state.currentBoard.title}
											/>
											<button onClick={this.deleteBoard}>Delete board</button>
										</div>
									) : (
											<h2>{this.state.message}</h2>
										)}
									<div className="lists-wrapper">
										{Object.keys(this.state.currentLists).map(key => {
											return (
												<List
													key={this.state.currentLists[key].id}
													list={this.state.currentLists[key]}
													deleteList={this.props.deleteList}
												/>
											)
										})}

									</div>

									<form onSubmit={(e) => this.createNewList(e, user.id)} className="new-list-wrapper">
										<input
											type={this.state.message === '' ? 'text' : 'hidden'}
											ref={this.addBoardInput}
											name="name"
											placeholder=" + New list"
										/>
									</form>
								</div>
							) : (
									<span></span>
								)
						}
					</React.Fragment>
				)}
			</AuthConsumer >
		)
	}
}

Board.propTypes = {
	deleteBoard: PropTypes.func.isRequired,
	updateBoard: PropTypes.func.isRequired,
	deleteList: PropTypes.func.isRequired,
}

export default Board

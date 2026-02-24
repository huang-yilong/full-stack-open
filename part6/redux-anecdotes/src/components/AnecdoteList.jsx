import { useSelector, useDispatch } from 'react-redux'
import { votedAnecdote } from '../reducers/anecdoteReducer'
import { setNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes)
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  const vote = id => {
    console.log('vote', id)
    // dispatch vote action
    dispatch(votedAnecdote(id, {...anecdotes.find(a => a.id === id), votes: anecdotes.find(a => a.id === id).votes + 1 }))
    dispatch(setNotification(`you voted '${anecdotes.find(a => a.id === id).content}'`, 10))
  }

  return (
    <div>
      {anecdotes.filter(anecdote => anecdote.content.includes(filter)).sort((a, b) => b.votes - a.votes).map(anecdote => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList

import React from 'react'
import {connect } from 'react-redux'
import {formatTweet,formatDate} from '../utils/helpers'
import { TiArrowBackOutline } from 'react-icons/ti/index'
import { TiHeartOutline } from 'react-icons/ti/index'
import { TiHeartFullOutline } from 'react-icons/ti/index'
import {handdleToggleTweet} from '../Actions/tweets'
import {Link,withRouter} from 'react-router-dom'


class Tweet extends React.Component{
    toParent = (e,id) =>{
        e.preventDefault()
        this.props.history.push(`/tweet/${id}`)
    }
    handleLike = (e) =>{
        e.preventDefault()
        const {dispatch,tweet,authedUser} = this.props

        dispatch(handdleToggleTweet({
            id: tweet.id,
            hasLiked: tweet.hasLiked,
            authedUser
        }))
    }
    render(){
        const {tweet} = this.props
        if(tweet === null){
            return <p>This tweet does not exist </p>
        }
        const {
            name,avatar,timestamp,text,hasLiked,likes,id,replies,parent
        } = tweet
        return(
            <Link to={`/tweet/${id}`} className="tweet">
                <img 
                src={avatar}
                alt={`Avatar of ${name}`}
                className="avatar"
                />
                <div className="tweet-info">
                    <div>
                   <span>{name}</span> 
                   <div>{formatDate(timestamp)}</div>
                   {parent && (
                       <button className="replying-to" onClick={(e)=> this.toParent(e,parent.id)}>
                           Replying to @{parent.author}
                       </button>
                   )}
                   <p>{text}</p>
                   </div>
                <div className="tweet-icons">
                    <TiArrowBackOutline className="tweet-icon"/>
                    <span>{replies !== 0 && replies}</span>
                    <button className="heart-button" onClick={this.handleLike}>
                    {hasLiked === true ?
                    <TiHeartFullOutline color='#e0245e' className="tweet-icon"/>
                    : <TiHeartOutline className="tweet-icon"/>}
                    </button>
                    <span>{likes !== 0 && likes}</span>
                </div>
                </div>
            </Link>
        )
    }
}

function mapStateToProps({authedUser,users,tweets},{id}){
// give access to the store inside of the components 
const tweet = tweets[id]
const parentTweet = tweet ? tweets[tweet.replyingTo] : null
    return{
        authedUser,
        tweet: tweet ?
         formatTweet(tweet,users[tweet.author],authedUser,parentTweet)
         : null
    }
}

export default withRouter(connect(mapStateToProps)(Tweet))
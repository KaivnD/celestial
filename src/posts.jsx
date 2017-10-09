import React from 'react';
import { Link } from 'react-router-dom';
import PostList from './list';
import LoadingIcon from './loading-icon.gif';
import Placeholder from './placeholder.jpg';

class Posts extends React.Component {

    constructor(props) {
        super(props);
        this.getMorePosts = this.getMorePosts.bind(this);
        this.state = {
            posts: [],
            page: 0,
            getPosts: true
        }
    }

    componentDidMount() {
        var that = this;
        window.onbeforeunload = function () { window.scrollTo(0, 0); }

        // init controller
        var controller = new ScrollMagic.Controller();

        // build scene
        var scene = new ScrollMagic.Scene({ triggerElement: "#posts-here", triggerHook: "onEnter" })
            .addTo(controller)
            .on("enter", function (e) {
                if (that.state.getPosts) {
                    that.getMorePosts();
                }
            });
    }

    getMorePosts() {
        var that = this;
        var totalPages;
        // adding a loader
        jQuery("#loader").addClass("active");
        this.setState({ page: this.state.page + 1 });

        fetch(CelestialSettings.URL.api + "/posts/?page=" + this.state.page)
            .then(function (response) {
                for (var pair of response.headers.entries()) {
                    if (pair[0] == 'x-wp-totalpages') {
                        totalPages = pair[1];
                    }
                    if (that.state.page == totalPages) {
                        that.state.getPosts = false;
                    }
                }
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then(function (results) {
                that.setState({ posts: results })
            }).catch(function (error) {
                console.err('There has been a problem with your fetch operation: ' + error.message);
                jQuery("#loader").remove();
            });
    }

    render() {
        if (this.state.posts.length == 0) {
            return null;
        }
        return (
            <div id="content">
                <div className="container">
                    <h1 className="posts-title">Posts</h1>
                        <PostList posts={this.state.posts} />
                </div>
            </div>
        );
    }
}

export default Posts;
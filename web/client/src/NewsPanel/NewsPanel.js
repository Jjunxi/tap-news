import React from 'react';
import './NewsPanel.css';
import Auth from '../Auth/Auth';
import NewsCard from '../NewsCard/NewsCard';
import { Link } from 'react-router';

import _ from 'lodash';

class NewsPanel extends React.Component {
    constructor() {
        super();
        this.state = {news:null, pageNum:1, loadedAll:false};
        this.handleScroll = this.handleScroll.bind(this);        
    }

    componentDidMount() {
        this.loadMoreNews();
        // warp loadMoreNews, only once within 500ms 
        this.loadMoreNews = _.debounce(this.loadMoreNews, 500);
        window.addEventListener('scroll', this.handleScroll);        
    }

    handleScroll() {
        // pixels scroll down
        let scrollY = window.scrollY || window.pageYOffset
            || document.documentElement.scrollTop;
        if ((window.innerHeight + scrollY) >= (document.body.offsetHeight - 50)) {
          console.log('Loading more news...');
          this.loadMoreNews();
        }
    }

    loadMoreNews() {
        if (this.state.loadedAll === true) {
            return;
        }

        let url = 'http://localhost:3000/news/userId/' + Auth.getEmail()
            + '/pageNum/' + this.state.pageNum;
        let request = new Request(encodeURI(url), {
            method: 'GET',
            headers: {
                'Authorization': 'bearer ' + Auth.getToken(),
              },
            cache: false
          });

        fetch(request)
          .then((res) => res.json())
          .then((loadedNews) => {
              if (!loadedNews || loadedNews.length === 0) {
                this.setState({ loadedAll: true });
            }
            this.setState({
              news: this.state.news ?
                  this.state.news.concat(loadedNews) : loadedNews,
              pageNum: this.state.pageNum + 1
            
            });
          });
    }

    renderNews() {
        const news_list = this.state.news.map(function(news) {
            return(
                <Link className="list-group-item" key={news.digest} to={news.url}>
                    <NewsCard news={news} />
                </Link>
            );
        });

        return(
            <div className="container-fluid">
                <div className="list-group">
                    {news_list}
                </div>
            </div>
        );

    }

    render() {
        if (this.state.news) {
            return(
                <div>
                    '{this.renderNews()}'
                </div>
            );
        } else {
            return(
                <div>
                    Loading...
                </div>
            );
        }

    }
}

export default NewsPanel;
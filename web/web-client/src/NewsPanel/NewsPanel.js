import React from 'react';
import './NewsPanel.css';

class NewsPanel extends React.Component {
    constructor() {
        super();
        this.state = {news:null};
    }

    componentDidMount() {
        this.loadMoreNews();
    }

    loadMoreNews() {
        this.setState({
            news: [

            ]
        });
    }

    renderNews() {
        const news_list = this.state.news.map(function(news) {
            return(
                <a className="list-group-item" key={news.digest} href='#'>
                    <NewsCard news={news} />
                </a>
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

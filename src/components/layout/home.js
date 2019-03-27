import React, { Component } from "react";
import { connect } from "react-redux";
import { Layout, Menu, Icon, Button, Input, Affix} from 'antd';
import AvatarSection from "components/sider/avatar";
import ImageCRUD from "components/image/crud"
import Gallery from "components/image/gallery"
import {
    switchModalVisibility
} from 'actions/crud';

const {
    Header, Content, Footer, Sider,
} = Layout;
class Home extends Component {
    state = {
        collapsed: true,
        searchText: ""
    };
    handleCollapse = (collapsed) => {
        this.setState({ collapsed });
    }
    handleSearch = (e) =>{
        this.setState({
            searchText: e.target.value
        });
    }
    handleAdd = ()=>{
        this.props.switchModalVisibility(true);
    }
    render() {
        return (
            <Layout style={styles.layoutContainer}>
                <Sider
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.handleCollapse}
                >
                    
                    <AvatarSection/>
                </Sider>
                <Layout>
                    <Header style={styles.header}>
                        <Button 
                            type="primary" 
                            shape="circle" 
                            size="large" 
                            icon="plus" 
                            onClick={this.handleAdd}
                        />
                        <Input.Search
                            style={styles.search}
                            placeholder="Search Image"
                            onChange={this.handleSearch}
                        />
                    </Header>
                    <Content style={styles.content}>
                        <Gallery searchText={this.state.searchText}/>
                    </Content>
                </Layout>
                <ImageCRUD />
            </Layout>
        );
    }
}
const styles = {
    layoutContainer:{
        minHeight: '100vh'
    },
    header: { 
        background: 'white', 
        padding: 5,
        paddingLeft: 10
    },
    content:{
        overflow: 'auto',
        margin: '16px',
        height: '80vh'
    },
    footer: { 
        textAlign: 'center' 
    },
    search: {
        paddingLeft: 20,
        width: 300 
    },
    col: {
        textAlign: "center"
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        credentials: state.authentication.credentials
    };
};
const mapDispatchToProps = {
    switchModalVisibility
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Home);

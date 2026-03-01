import React, { Component } from 'react'
import helper from '../../helper/auth'
import { signin, signup } from '../../services/api'
import { withStyles, Tabs, Tab, Paper } from '@material-ui/core';
import styles from './style';
import SwipeableView from 'react-swipeable-views'
import Signin from './Signin';
import Signup from './Signup';
import Snackbar from '../../components/Snackbar';


class Login extends Component {
  state = {
    tab: 0,
    loading: false,
    loader: {
      open: false,
      type: 'info',
      message: ''
    }
  }

  handleChange = () => {
    const { tab } = this.state;
    this.setState({ tab: tab === 1 ? 0 : 1 })
  };

  signin = async (values) => {
    this.setState({ loading: true })
    try {
      const resp = await signin(values)

      if (resp.status !== 200) return

      helper.setUser(resp.data)
      this.props.history.push('/')

    } catch (err) {
      this.setState({
        loader: {
          ...this.state.loader,
          open: true,
          type: 'error',
          message: 'Username ou senha incorretos!'
        }
      })
    } finally {
      this.setState({ loading: false })
    }
  }

  signup = async (values) => {
    this.setState({ loading: true })
    try {
      const resp = await signup(values)

      if (resp.status !== 200) return

      this.setState({
        loader: {
          ...this.state.loader,
          open: true,
          type: 'success',
          message: 'Cadastrado com sucesso!'
        }
      }, this.handleChange)
    } catch (err) {
      this.setState({
        loader: {
          ...this.state.loader,
          open: true,
          type: 'error',
          message: 'Erro ao cadastrar. Tente novamente!'
        }
      })
    } finally {
      this.setState({ loading: false })
    }
  }

  render() {
    const { classes, theme } = this.props;
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <Tabs value={this.state.tab} indicatorColor="primary" textColor="primary" onChange={this.handleChange}>
            <Tab label="sign in" />
            <Tab label="sign up" />
          </Tabs>

          <SwipeableView
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={this.state.tab}>
            {
              this.state.tab === 0 ? <Signin onSignin={this.signin} loading={this.state.loading} /> : <div></div>
            }
            {
              this.state.tab === 1 ? <Signup onSignup={this.signup} loading={this.state.loading} /> : <div></div>
            }
          </SwipeableView>

        </Paper>
        <Snackbar
          isOpen={this.state.loader.open}
          type={this.state.loader.type}
          message={this.state.loader.message}
          onClose={() => this.setState({ ...this.state, loader: { ...this.state.loader, open: false } })} />
      </div>
    )
  }
}

export default withStyles(styles, { withTheme: true })(Login)

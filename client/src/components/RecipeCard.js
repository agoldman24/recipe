import React from 'react';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { FETCH_RECIPE_REQUESTED } from '../actions';

// const useStyles = makeStyles(theme => ({
//   card: {
//     width: '90vw',
//   },
//   media: {
//     height: 0,
//     paddingTop: '56.25%', // 16:9
//   },
//   expand: {
//     transform: 'rotate(0deg)',
//     marginLeft: 'auto',
//     transition: theme.transitions.create('transform', {
//       duration: theme.transitions.duration.shortest,
//     }),
//   },
//   expandOpen: {
//     transform: 'rotate(180deg)',
//   }
// }));

class RecipeCard extends React.Component {
  state = {
    expanded: false
  }
  componentDidMount() {
    this.props.getRandomRecipe();
  }

  handleExpandClick = () => {
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    return (
    // <ThemeProvider theme={React.useMemo(
    //   () =>
    //     createMuiTheme({
    //       palette: {
    //         type: 'dark'
    //       },
    //     })
    // )}>
      <Card style={{width:"90vw"}}>
        <CardHeader
          title={this.props.activeRecipe.name}
        />
        <CardMedia
          style={{height: 0, paddingTop: '56.25%'}}
          image={this.props.activeRecipe.image}
        />
        <CardActions disableSpacing>
          <IconButton aria-label="add to favorites">
            <FavoriteIcon />
          </IconButton>
          <IconButton aria-label="share">
            <ShareIcon />
          </IconButton>
          {/* <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: this.state.expanded,
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton> */}
        </CardActions>
        <Collapse in={this.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Directions:</Typography>
            <Typography paragraph>
              {this.props.activeRecipe.directions}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    // </ThemeProvider>
    );
  }
};

const mapStateToProps = state => {
  return {
    activeRecipe: state.activeRecipe,
  };
}

const mapDispatchToProps = dispatch => {
  return {
    getRandomRecipe: () => dispatch({ type: FETCH_RECIPE_REQUESTED })
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecipeCard);
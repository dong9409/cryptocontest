import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';


const useStyles = makeStyles((theme) => ({
  root: {
   flex: 1,
   display: 'flex',
   justifyContent: 'center',
   alignItems: 'center',
   marginTop: '50px'
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
}));

export default function Favicon(data) {
const {value} = data;
  const classes = useStyles();

  return (
    <div className={classes.root}>{
        value &&(value === 'Valid proof' ?(
            <Fab variant="extended" color="primary">
                Valid proof
              </Fab>):(
              <Fab variant="extended" color="secondary">
               Unvalid proof
              </Fab>
              ))
    }
    
    </div>
  );
}

import { useState } from 'react';
import gql from 'graphql-tag';
import { Query, withApollo } from 'react-apollo';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import defaultProfile from '../../assets/images/defaultProfile.png';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import classnames from 'classnames';
import { compose } from 'recompose';

export const UserData = compose(withApollo)(({ classes, handleProfileMenuClick }) => {

    const doQuery = () => {
        return gql` {
        user(uid:"${localStorage.getItem('uid')}") {
          email
          name
          username
          avatar
        }
      }
      `
    }

    const [queryOut, setQueryOut] = useState({
        q: doQuery(),
        count: 0
    });

    return (
        <Query
            query={queryOut.q}
        >
            {({ loading, error, data }) => {
                let username;

                if (loading) {
                    username = 'Loading...';
                }
                else if (!error && (!data || !data.user)) {
                    username = 'Invalid user';
                    console.error('data:', data);
                } else if (error) {
                    username = 'Error: ' + error + ' (try: ' + queryOut.count + ')';
                    console.error('error:', error);
                    setTimeout(() => {
                        setQueryOut({
                            q: doQuery(),
                            count: queryOut.count + 1
                        });
                    }, 1000);
                } else {
                    username = data.user.name;
                }

                return (
                    <>
                        {(!data || !data.user) ? null :
                            <Avatar
                                src={data.user.avatar != null ? data.user.avatar : defaultProfile}
                                alt="user avatar"
                                className={classes.avatar}
                            />
                        }
                        <Button
                            aria-controls="user-menu"
                            aria-haspopup="true"
                            onClick={handleProfileMenuClick}
                            disableRipple
                            className={classnames(
                                classes.expandButton,
                                classes.expandProfileButton,
                            )}
                        >
                            {username}
                            <ExpandMoreIcon />
                        </Button>
                    </>
                );
            }}
        </Query>
    );
})

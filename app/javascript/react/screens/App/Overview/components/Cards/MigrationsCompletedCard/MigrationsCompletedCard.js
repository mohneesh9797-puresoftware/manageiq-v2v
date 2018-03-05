import React from 'react';
import PropTypes from 'prop-types';
import { Icon, Spinner } from 'patternfly-react';
import MigrationCompletedRow from './MigrationCompletedRow';

class MigrationsCompletedCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingMigrationsCompleted: false
    };
  }
  componentDidMount() {
    const { fetchMigrationsCompletedAction } = this.props;
    // fetch migrations completed initially, then poll them
    fetchMigrationsCompletedAction();
    setInterval(fetchMigrationsCompletedAction, 10000);
  }

  componentWillReceiveProps(nextProps) {
    // make the loading animation smooth - delay three seconds even if the backend is immediate
    if (nextProps.isFetchingMigrationsCompleted) {
      this.setState({
        isFetchingMigrationsCompleted: true
      });
    } else {
      setTimeout(() => {
        this.setState({
          isFetchingMigrationsCompleted: false
        });
      }, 3000);
    }
  }

  renderCompletedMigrations() {
    const { migrationsCompleted } = this.props;

    return (
      <div className="list-group list-view-pf list-view-pf-view completed-migrations-list">
        {migrationsCompleted.map((migration, index) => (
          <MigrationCompletedRow migration={migration} key={migration.id} />
        ))}
      </div>
    );
  }

  render() {
    const {
      isRejectedMigrationsCompleted,
      errorMigrationsCompleted,
      migrationsCompleted
    } = this.props;

    const { isFetchingMigrationsCompleted } = this.state;

    return (
      <div className="card-pf">
        <div className="card-pf-heading">
          <h2 className="card-pf-title">
            {sprintf(__('%s Completed Migrations'), migrationsCompleted.length)}
          </h2>
        </div>
        <div className="card-pf-body">
          {isFetchingMigrationsCompleted && (
            <React.Fragment>
              <Spinner size="xs" inline loading />
              <span className="message-text">
                {__('Loading completed migrations in progress')}
              </span>
            </React.Fragment>
          )}
          {isRejectedMigrationsCompleted && (
            <React.Fragment>
              <Icon type="pf" name="error-circle-o" />
              <span className="message-text">
                {errorMigrationsCompleted
                  ? errorMigrationsCompleted.message
                  : __('Error retrieving completed migrations')}
              </span>
            </React.Fragment>
          )}
          {migrationsCompleted.length > 0 && this.renderCompletedMigrations()}
        </div>
      </div>
    );
  }
}

MigrationsCompletedCard.propTypes = {
  fetchMigrationsCompletedAction: PropTypes.func,
  isFetchingMigrationsCompleted: PropTypes.bool,
  migrationsCompleted: PropTypes.arrayOf(PropTypes.object),
  isRejectedMigrationsCompleted: PropTypes.bool,
  errorMigrationsCompleted: PropTypes.object
};
MigrationsCompletedCard.defaultProps = {
  migrationsCompleted: [],
  isFetchingMigrationsCompleted: false,
  isRejectedMigrationsCompleted: false,
  errorMigrationsCompleted: null
};

export default MigrationsCompletedCard;

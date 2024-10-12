import React from 'react';
import { Link } from 'react-router-dom';
import { CompatabilityCharts } from './CompatabilityCharts';

function Dashboard({ firstTwoTeams, mbtiData, mbtiType }) {
  return (
    <main className="home">
      <div className="rectdashboard">
        <h3>Recent Activity</h3>
        <h4>Teams:</h4>
        <div className="classlinks">
          <Link to={"/teams/" + firstTwoTeams[0]}>
            <div className="rectclass">
              <p>{firstTwoTeams[0]}</p>
            </div>
          </Link>
          <Link to={"/teams/" + firstTwoTeams[1]}>
            <div className="rectclass">
              <p>{firstTwoTeams[1]}</p>
            </div>
          </Link>
        </div>
        <h4>Your MBTI Assessment:</h4>
        <div className="comphome">
          <CompatabilityCharts mbtiData={mbtiData} mbtiType={mbtiType} customClass="home-chart" />
        </div>
        <Link to="/compatability">
          <button className="complink">Go To Full Report</button>
        </Link>
      </div>
    </main>
  );
}

export { Dashboard };
import React from 'react';
import { CompatabilityCharts } from './CompatabilityCharts';

function Compatability({ profile }) {
  const { mbtiData, mbti } = profile;

  return (
    <div className="mainmbti">
      <header>
        <h1 className="compheader">{profile.name}'s Assessment</h1>
      </header>
      <div className="mbtibody">
        <CompatabilityCharts mbtiData={mbtiData} mbtiType={mbti} customClass="comp-chart" />
      </div>
      <div className="compdesc">
        {<Assessment title={mbtiData.EI || 0} kind={mbti && mbti[0] === 'E' && 'Extraverted' || 'Introverted'} nonDominant={mbti && mbti[0] === 'E' && 'Introverted' || 'Extraverted'} />}
        {<Assessment title={mbtiData.SN || 0} kind={mbti && mbti[1] === 'S' && 'Observant' || 'Intuitive'} nonDominant={mbti && mbti[1] === 'S' && 'Intuitive' || 'Observant'} />}
        {<Assessment title={mbtiData.TF || 0} kind={mbti && mbti[2] === 'T' && 'Thinking' || 'Feeling'} nonDominant={mbti && mbti[2] === 'T' && 'Feeling' || 'Thinking'} />}
        {<Assessment title={mbtiData.JP || 0} kind={mbti && mbti[3] === 'J' && 'Judging' || 'Prospecting'} nonDominant={mbti && mbti[3] === 'J' && 'Prospecting' || 'Judging'} />}
      </div>
    </div>
  );
}

function Assessment({ title, kind, nonDominant }) {
  const percentage = title;
  const kindId = kind.substring(0, 4).toLowerCase();

  return (
    <div className="assessment-container">
      <div className={`desc`} id={kindId}>
        <p>
          You are <b>{percentage}%</b> more <b><em>{kind}</em></b> than {nonDominant}.
        </p>
      </div>
    </div>
  );
}

export { Compatability };
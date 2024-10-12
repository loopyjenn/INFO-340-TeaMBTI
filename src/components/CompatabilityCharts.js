import React from 'react';
import { PieChart, PieArcSeries } from 'reaviz';

const CompatabilityCharts = ({ mbtiData, mbtiType, customClass }) => {
  const getChartData = (percentage, type1, type2, mbtiType) => {
    const isType1Dominant = mbtiType && mbtiType.includes(type1);
    const dominantType = isType1Dominant && type1 || type2;
    const nonDominantType = isType1Dominant && type2 || type1;
    return [
      { key: dominantType, data: percentage },
      { key: nonDominantType, data: 100 - percentage }
    ];
  };

  console.log('mbtiData:', mbtiData);
  console.log('mbtiType:', mbtiType);

  const dataEI = getChartData(mbtiData.EI || 0, 'E', 'I', mbtiType);
  const dataSN = getChartData(mbtiData.SN || 0, 'S', 'N', mbtiType);
  const dataTF = getChartData(mbtiData.TF || 0, 'T', 'F', mbtiType);
  const dataJP = getChartData(mbtiData.JP || 0, 'J', 'P', mbtiType);

  return (
    <div className={`chart-container ${customClass}`}>
      <div className="charttop" id="comp-top">
        <div className="chart-wrap" id="comp-ei">
          <PieChart
            width={250}
            height={250}
            data={dataEI}
            series={<PieArcSeries colorScheme={['#E5E8B6', '#F6DC8D']} />}
          />
        </div>
        <div className="chart-wrap" id="comp-sn">
          <PieChart
            width={250}
            height={250}
            data={dataSN}
            series={<PieArcSeries colorScheme={['#BEB8EB', '#022B3A']} />}
          />
        </div>
      </div>
      <div className="chartbottom" id="comp-bottom">
        <div className="chart-wrap" id="comp-tf">
          <PieChart
            width={250}
            height={250}
            data={dataTF}
            series={<PieArcSeries colorScheme={['#E3EEE2', '#ACD1E9']} />}
          />
        </div>
        <div className="chart-wrap" id="comp-jp">
          <PieChart
            width={250}
            height={250}
            data={dataJP}
            series={<PieArcSeries colorScheme={['#F49A9A91', '#E0E0E2']} />}
          />
        </div>
      </div>
    </div>
  );
};

export { CompatabilityCharts };

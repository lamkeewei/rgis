'use strict';

angular.module('rgisApp')
  .controller('PluginInputCtrl', ['$scope', '$modal', '$log', function ($scope, $modal, $log) {
    $scope.data = [
      {x: 0, val_0: 0, val_1: 0, val_2: 0, val_3: 0},
      {x: 1, val_0: 0.993, val_1: 3.894, val_2: 8.47, val_3: 14.347},
      {x: 2, val_0: 1.947, val_1: 7.174, val_2: 13.981, val_3: 19.991},
      {x: 3, val_0: 2.823, val_1: 9.32, val_2: 14.608, val_3: 13.509},
      {x: 4, val_0: 3.587, val_1: 9.996, val_2: 10.132, val_3: -1.167},
      {x: 5, val_0: 4.207, val_1: 9.093, val_2: 2.117, val_3: -15.136},
      {x: 6, val_0: 4.66, val_1: 6.755, val_2: -6.638, val_3: -19.923},
      {x: 7, val_0: 4.927, val_1: 3.35, val_2: -13.074, val_3: -12.625},
      {x: 8, val_0: 4.998, val_1: -0.584, val_2: -14.942, val_3: 2.331},
      {x: 9, val_0: 4.869, val_1: -4.425, val_2: -11.591, val_3: 15.873},
      {x: 10, val_0: 4.546, val_1: -7.568, val_2: -4.191, val_3: 19.787},
      {x: 11, val_0: 4.042, val_1: -9.516, val_2: 4.673, val_3: 11.698},
      {x: 12, val_0: 3.377, val_1: -9.962, val_2: 11.905, val_3: -3.487},
      {x: 13, val_0: 2.578, val_1: -8.835, val_2: 14.978, val_3: -16.557},
      {x: 14, val_0: 1.675, val_1: -6.313, val_2: 12.819, val_3: -19.584},
      {x: 15, val_0: 0.706, val_1: -2.794, val_2: 6.182, val_3: -10.731},
      {x: 16, val_0: -0.292, val_1: 1.165, val_2: -2.615, val_3: 4.63},
      {x: 17, val_0: -1.278, val_1: 4.941, val_2: -10.498, val_3: 17.183},
      {x: 18, val_0: -2.213, val_1: 7.937, val_2: -14.714, val_3: 19.313},
      {x: 19, val_0: -3.059, val_1: 9.679, val_2: -13.79, val_3: 9.728},
      {x: 20, val_0: -3.784, val_1: 9.894, val_2: -8.049, val_3: -5.758},
      {x: 21, val_0: -4.358, val_1: 8.546, val_2: 0.504, val_3: -17.751},
      {x: 22, val_0: -4.758, val_1: 5.849, val_2: 8.881, val_3: -18.977},
      {x: 23, val_0: -4.968, val_1: 2.229, val_2: 14.155, val_3: -8.691},
      {x: 24, val_0: -4.981, val_1: -1.743, val_2: 14.485, val_3: 6.866},
      {x: 25, val_0: -4.795, val_1: -5.44, val_2: 9.754, val_3: 18.259},
      {x: 26, val_0: -4.417, val_1: -8.278, val_2: 1.616, val_3: 18.576},
      {x: 27, val_0: -3.864, val_1: -9.809, val_2: -7.086, val_3: 7.625},
      {x: 28, val_0: -3.156, val_1: -9.792, val_2: -13.314, val_3: -7.951},
      {x: 29, val_0: -2.323, val_1: -8.228, val_2: -14.89, val_3: -18.704},
      {x: 30, val_0: -1.397, val_1: -5.366, val_2: -11.265, val_3: -18.112},
      {x: 31, val_0: -0.415, val_1: -1.656, val_2: -3.705, val_3: -6.533},
      {x: 32, val_0: 0.583, val_1: 2.315, val_2: 5.15, val_3: 9.009},
      {x: 33, val_0: 1.558, val_1: 5.921, val_2: 12.205, val_3: 19.086},
      {x: 34, val_0: 2.471, val_1: 8.592, val_2: 14.997, val_3: 17.585},
      {x: 35, val_0: 3.285, val_1: 9.906, val_2: 12.55, val_3: 5.418},
      {x: 36, val_0: 3.968, val_1: 9.657, val_2: 5.719, val_3: -10.036},
      {x: 37, val_0: 4.494, val_1: 7.883, val_2: -3.11, val_3: -19.402},
      {x: 38, val_0: 4.84, val_1: 4.864, val_2: -10.852, val_3: -16.999},
      {x: 39, val_0: 4.993, val_1: 1.078, val_2: -14.804, val_3: -4.285},
      {x: 40, val_0: 4.947, val_1: -2.879, val_2: -13.584, val_3: 11.029},
      {x: 41, val_0: 4.704, val_1: -6.381, val_2: -7.618, val_3: 19.652},
      {x: 42, val_0: 4.273, val_1: -8.876, val_2: 1.008, val_3: 16.355},
      {x: 43, val_0: 3.672, val_1: -9.969, val_2: 9.283, val_3: 3.137},
      {x: 44, val_0: 2.925, val_1: -9.488, val_2: 14.314, val_3: -11.984},
      {x: 45, val_0: 2.061, val_1: -7.51, val_2: 14.346, val_3: -19.836},
      {x: 46, val_0: 1.114, val_1: -4.346, val_2: 9.366, val_3: -15.655},
      {x: 47, val_0: 0.124, val_1: -0.495, val_2: 1.114, val_3: -1.979},
      {x: 48, val_0: -0.872, val_1: 3.433, val_2: -7.527, val_3: 12.898},
      {x: 49, val_0: -1.832, val_1: 6.82, val_2: -13.538, val_3: 19.951},
      {x: 50, val_0: -2.72, val_1: 9.129, val_2: -14.82, val_3: 14.902},
      {x: 51, val_0: -3.499, val_1: 9.998, val_2: -10.925, val_3: 0.814},
      {x: 52, val_0: -4.139, val_1: 9.288, val_2: -3.214, val_3: -13.768},
      {x: 53, val_0: -4.614, val_1: 7.112, val_2: 5.621, val_3: -19.999},
      {x: 54, val_0: -4.905, val_1: 3.813, val_2: 12.491, val_3: -14.098},
      {x: 55, val_0: -5, val_1: -0.089, val_2: 14.999, val_3: 0.354},
      {x: 56, val_0: -4.896, val_1: -3.976, val_2: 12.266, val_3: 14.592},
      {x: 57, val_0: -4.597, val_1: -7.235, val_2: 5.249, val_3: 19.978},
      {x: 58, val_0: -4.114, val_1: -9.352, val_2: -3.602, val_3: 13.246},
      {x: 59, val_0: -3.468, val_1: -9.993, val_2: -11.194, val_3: -1.521},
      {x: 60, val_0: -2.683, val_1: -9.056, val_2: -14.877, val_3: -15.365},
      {x: 61, val_0: -1.791, val_1: -6.689, val_2: -13.362, val_3: -19.889},
      {x: 62, val_0: -0.828, val_1: -3.266, val_2: -7.18, val_3: -12.349},
      {x: 63, val_0: 0.168, val_1: 0.672, val_2: 1.511, val_3: 2.682},
      {x: 64, val_0: 1.158, val_1: 4.504, val_2: 9.673, val_3: 16.086},
      {x: 65, val_0: 2.101, val_1: 7.626, val_2: 14.457, val_3: 19.733},
      {x: 66, val_0: 2.96, val_1: 9.543, val_2: 14.19, val_3: 11.409},
      {x: 67, val_0: 3.702, val_1: 9.954, val_2: 8.966, val_3: -3.835},
      {x: 68, val_0: 4.296, val_1: 8.793, val_2: 0.61, val_3: -16.753},
      {x: 69, val_0: 4.718, val_1: 6.244, val_2: -7.959, val_3: -19.509},
      {x: 70, val_0: 4.953, val_1: 2.709, val_2: -13.748, val_3: -10.431},
      {x: 71, val_0: 4.99, val_1: -1.253, val_2: -14.734, val_3: 4.974},
      {x: 72, val_0: 4.828, val_1: -5.018, val_2: -10.574, val_3: 17.362},
      {x: 73, val_0: 4.474, val_1: -7.99, val_2: -2.719, val_3: 19.218},
      {x: 74, val_0: 3.941, val_1: -9.701, val_2: 6.085, val_3: 9.417},
      {x: 75, val_0: 3.251, val_1: -9.88, val_2: 12.764, val_3: -6.096},
      {x: 76, val_0: 2.432, val_1: -8.5, val_2: 14.984, val_3: -17.912},
      {x: 77, val_0: 1.516, val_1: -5.777, val_2: 11.969, val_3: -18.862},
      {x: 78, val_0: 0.539, val_1: -2.143, val_2: 4.774, val_3: -8.371},
      {x: 79, val_0: -0.46, val_1: 1.83, val_2: -4.089, val_3: 7.198},
      {x: 80, val_0: -1.44, val_1: 5.514, val_2: -11.524, val_3: 18.401},
      {x: 81, val_0: -2.362, val_1: 8.328, val_2: -14.933, val_3: 18.442},
      {x: 82, val_0: -3.191, val_1: 9.826, val_2: -13.125, val_3: 7.297},
      {x: 83, val_0: -3.892, val_1: 9.773, val_2: -6.733, val_3: -8.275},
      {x: 84, val_0: -4.438, val_1: 8.178, val_2: 2.012, val_3: -18.827},
      {x: 85, val_0: -4.807, val_1: 5.291, val_2: 10.053, val_3: -17.959},
      {x: 86, val_0: -4.985, val_1: 1.569, val_2: 14.583, val_3: -6.197},
      {x: 87, val_0: -4.963, val_1: -2.401, val_2: 14.019, val_3: 9.323},
      {x: 88, val_0: -4.744, val_1: -5.992, val_2: 8.557, val_3: 19.189},
      {x: 89, val_0: -4.336, val_1: -8.637, val_2: 0.106, val_3: 17.414},
      {x: 90, val_0: -3.755, val_1: -9.918, val_2: -8.382, val_3: 5.076},
      {x: 91, val_0: -3.024, val_1: -9.633, val_2: -13.942, val_3: -10.34},
      {x: 92, val_0: -2.173, val_1: -7.828, val_2: -14.631, val_3: -19.485},
      {x: 93, val_0: -1.235, val_1: -4.786, val_2: -10.21, val_3: -16.81},
      {x: 94, val_0: -0.248, val_1: -0.989, val_2: -2.222, val_3: -3.939},
      {x: 95, val_0: 0.749, val_1: 2.964, val_2: 6.542, val_3: 11.322},
      {x: 96, val_0: 1.717, val_1: 6.449, val_2: 13.021, val_3: 19.715},
      {x: 97, val_0: 2.615, val_1: 8.916, val_2: 14.951, val_3: 16.149},
      {x: 98, val_0: 3.41, val_1: 9.976, val_2: 11.659, val_3: 2.787},
      {x: 99, val_0: 4.068, val_1: 9.46, val_2: 4.293, val_3: -12.265}
    ];
    
    $scope.options = {
      series: [
        {y: 'val_0', label: 'A colorful area series', color: '#ff7f0e', type: 'area'}
      ],
      axes: {
        x: {type: 'linear', key: 'x'},
        y: {type: 'linear'}
      },
      lineMode: 'linear',
      tooltipMode: 'default'
    };

    $scope.openPlugin = function(pluginName, controller){
      var modal = $modal.open({
        templateUrl: 'views/' + pluginName + '.html',
        controller: controller,
        keyboard: true
      });

      modal.result.then(function(status){
        $log.info('Reply received!');
      });
    };
  }]);

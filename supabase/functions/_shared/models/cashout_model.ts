// Auto-generated GradientBoostingClassifier model export for Supabase Edge Functions
export const CASHOUT_MODEL_DATA = {
  "model_version": "SIH-ML-Cashout-GBClassifier-v2.0.0",
  "model_type": "GradientBoostingClassifier",
  "feature_names": [
    "distance_km",
    "historical_fraud_count",
    "cctv_available",
    "is_csp",
    "case_amount",
    "cashout_hour",
    "distance_rank"
  ],
  "learning_rate": 0.1,
  "init_value": -1.94591015,
  "n_estimators": 50,
  "max_depth": 3,
  "metadata": {
    "dataset_name": "Delhi-NCR Synthetic Cybercrime Historical Cashouts",
    "num_events": 250,
    "num_locations": 8,
    "total_samples": 2000,
    "positive_samples": 250,
    "negative_samples": 1750,
    "trained_at": "2026-10-05T01:17:34.737572"
  },
  "trees": [
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": 0.0
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.735
        },
        {
          "feature": 0,
          "threshold": 1.4345,
          "left": 3,
          "right": 4,
          "value": 0.00833333
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 4.95238095
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.14285714
        },
        {
          "feature": 0,
          "threshold": 5.2574,
          "left": 6,
          "right": 7,
          "value": 0.78138298
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 7.30301089
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 4.19047619
        },
        {
          "feature": 0,
          "threshold": 3.8054,
          "left": 9,
          "right": 12,
          "value": -0.105
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 10,
          "right": 11,
          "value": 0.18647541
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.09973046
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 5.71428571
        },
        {
          "feature": 0,
          "threshold": 5.7766,
          "left": 13,
          "right": 14,
          "value": -0.11552694
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.22148394
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.12527473
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00319265
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.6397208
        },
        {
          "feature": 0,
          "threshold": 1.4345,
          "left": 3,
          "right": 4,
          "value": 0.00493275
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 3.09918278
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.12742901
        },
        {
          "feature": 1,
          "threshold": 10.5,
          "left": 6,
          "right": 7,
          "value": 0.68023919
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 3.23176152
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 4.09383148
        },
        {
          "feature": 0,
          "threshold": 3.8054,
          "left": 9,
          "right": 12,
          "value": -0.09503743
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 10,
          "right": 11,
          "value": 0.16550169
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.90838762
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 3.40152746
        },
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 13,
          "right": 14,
          "value": -0.10444708
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.36658572
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.12765326
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00411439
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.56900365
        },
        {
          "feature": 0,
          "threshold": 1.4345,
          "left": 3,
          "right": 4,
          "value": 0.00313129
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.31289141
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.11384257
        },
        {
          "feature": 0,
          "threshold": 5.2574,
          "left": 6,
          "right": 7,
          "value": 0.60512316
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.92431001
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.88341884
        },
        {
          "feature": 0,
          "threshold": 3.8054,
          "left": 9,
          "right": 12,
          "value": -0.0859884
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 10,
          "right": 11,
          "value": 0.14791327
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.76337598
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.52104687
        },
        {
          "feature": 0,
          "threshold": 5.7766,
          "left": 13,
          "right": 14,
          "value": -0.094436
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.17141937
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.09359121
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00443612
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.50906516
        },
        {
          "feature": 4,
          "threshold": 25000.0,
          "left": 3,
          "right": 4,
          "value": 0.00196772
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 3.48299287
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.48261198
        },
        {
          "feature": 1,
          "threshold": 10.5,
          "left": 6,
          "right": 7,
          "value": 0.54143308
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.94548438
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.46115403
        },
        {
          "feature": 0,
          "threshold": 3.8054,
          "left": 9,
          "right": 12,
          "value": -0.07779344
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 10,
          "right": 11,
          "value": 0.13252512
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.64968743
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.02540028
        },
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 13,
          "right": 14,
          "value": -0.08538932
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.30464667
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.10222673
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00448795
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.45674115
        },
        {
          "feature": 0,
          "threshold": 1.4345,
          "left": 3,
          "right": 4,
          "value": 0.00136892
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.71171487
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.09704464
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 6,
          "right": 7,
          "value": 0.48580746
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.86529877
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.32494694
        },
        {
          "feature": 0,
          "threshold": 3.8054,
          "left": 9,
          "right": 12,
          "value": -0.07037782
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 10,
          "right": 11,
          "value": 0.11890141
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.55827839
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.69908694
        },
        {
          "feature": 0,
          "threshold": 5.7766,
          "left": 13,
          "right": 14,
          "value": -0.07721384
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.12930966
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.06745307
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00440051
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.4104694
        },
        {
          "feature": 0,
          "threshold": 1.4345,
          "left": 3,
          "right": 4,
          "value": 0.00069411
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.44688942
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.0869616
        },
        {
          "feature": 0,
          "threshold": 4.33435,
          "left": 6,
          "right": 7,
          "value": 0.43662527
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.82194468
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.15676661
        },
        {
          "feature": 0,
          "threshold": 3.8054,
          "left": 9,
          "right": 12,
          "value": -0.06366764
        },
        {
          "feature": 0,
          "threshold": 2.0806,
          "left": 10,
          "right": 11,
          "value": 0.10677222
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.73850158
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.43644707
        },
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 13,
          "right": 14,
          "value": -0.06982326
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.24823113
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.082288
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00424521
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.36930994
        },
        {
          "feature": 4,
          "threshold": 25000.0,
          "left": 3,
          "right": 4,
          "value": 0.00020309
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.27801094
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.44377583
        },
        {
          "feature": 1,
          "threshold": 10.5,
          "left": 6,
          "right": 7,
          "value": 0.39286995
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.23276679
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.68769926
        },
        {
          "feature": 0,
          "threshold": 3.8054,
          "left": 9,
          "right": 12,
          "value": -0.05761024
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 10,
          "right": 11,
          "value": 0.09561201
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.38670823
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.40825477
        },
        {
          "feature": 0,
          "threshold": 5.7766,
          "left": 13,
          "right": 14,
          "value": -0.06314402
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.09484122
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.04518311
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00403325
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.33255814
        },
        {
          "feature": 0,
          "threshold": 1.4345,
          "left": 3,
          "right": 4,
          "value": 9.249e-05
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.20014898
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.07461883
        },
        {
          "feature": 0,
          "threshold": 4.33435,
          "left": 6,
          "right": 7,
          "value": 0.35377935
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.50099145
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.86218228
        },
        {
          "feature": 0,
          "threshold": 3.8054,
          "left": 9,
          "right": 12,
          "value": -0.05211774
        },
        {
          "feature": 0,
          "threshold": 3.7998,
          "left": 10,
          "right": 11,
          "value": 0.08593897
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.44057557
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 5.33035113
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 13,
          "right": 14,
          "value": -0.0571038
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.24549228
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.0370492
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00380512
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.29961811
        },
        {
          "feature": 4,
          "threshold": 25000.0,
          "left": 3,
          "right": 4,
          "value": -0.00023356
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.90256815
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.40904807
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 6,
          "right": 7,
          "value": 0.31875758
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.19497868
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.64560771
        },
        {
          "feature": 0,
          "threshold": 5.7766,
          "left": 9,
          "right": 12,
          "value": -0.0471513
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 10,
          "right": 11,
          "value": 0.02289419
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.12542038
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.95416955
        },
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 13,
          "right": 14,
          "value": -0.05568248
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.43746413
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.06034389
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00358224
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.27006697
        },
        {
          "feature": 0,
          "threshold": 1.4345,
          "left": 3,
          "right": 4,
          "value": -0.0002268
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.02932628
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.06433001
        },
        {
          "feature": 0,
          "threshold": 5.2574,
          "left": 6,
          "right": 7,
          "value": 0.28731977
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.27402783
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.40224453
        },
        {
          "feature": 0,
          "threshold": 2.0806,
          "left": 9,
          "right": 12,
          "value": -0.04267499
        },
        {
          "feature": 5,
          "threshold": 3.5,
          "left": 10,
          "right": 11,
          "value": 0.34065133
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.95326502
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 4.33318286
        },
        {
          "feature": 0,
          "threshold": 5.7766,
          "left": 13,
          "right": 14,
          "value": -0.04421445
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.07062119
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.01669768
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00335326
        },
        {
          "feature": 1,
          "threshold": 10.5,
          "left": 2,
          "right": 5,
          "value": 0.24349773
        },
        {
          "feature": 0,
          "threshold": 5.0793,
          "left": 3,
          "right": 4,
          "value": 0.14401831
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.86225398
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.0567777
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 6,
          "right": 7,
          "value": 0.28295605
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.53338002
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.99537309
        },
        {
          "feature": 0,
          "threshold": 2.0806,
          "left": 9,
          "right": 12,
          "value": -0.03861769
        },
        {
          "feature": 5,
          "threshold": 3.5,
          "left": 10,
          "right": 11,
          "value": 0.30380665
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.81403454
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 3.16108276
        },
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 13,
          "right": 14,
          "value": -0.03999289
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.00208365
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.04902671
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00312382
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.21962363
        },
        {
          "feature": 4,
          "threshold": 25000.0,
          "left": 3,
          "right": 4,
          "value": -0.00825719
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.61759281
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.4403777
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 6,
          "right": 7,
          "value": 0.23416921
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.93228936
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.43990069
        },
        {
          "feature": 0,
          "threshold": 2.0806,
          "left": 9,
          "right": 12,
          "value": -0.03494488
        },
        {
          "feature": 4,
          "threshold": 90000.0,
          "left": 10,
          "right": 11,
          "value": 0.27218272
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.73296975
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.3580088
        },
        {
          "feature": 0,
          "threshold": 5.7766,
          "left": 13,
          "right": 14,
          "value": -0.03617833
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.06346721
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.99915717
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00290183
        },
        {
          "feature": 1,
          "threshold": 10.5,
          "left": 2,
          "right": 5,
          "value": 0.19811301
        },
        {
          "feature": 0,
          "threshold": 5.0793,
          "left": 3,
          "right": 4,
          "value": 0.11300531
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.72737235
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.04534469
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 6,
          "right": 7,
          "value": 0.23187081
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.41779901
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.84604909
        },
        {
          "feature": 0,
          "threshold": 2.0806,
          "left": 9,
          "right": 12,
          "value": -0.03161824
        },
        {
          "feature": 0,
          "threshold": 1.7021,
          "left": 10,
          "right": 11,
          "value": 0.24387129
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.42575095
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.5428604
        },
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 13,
          "right": 14,
          "value": -0.03272462
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.008338
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.03994705
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.0026906
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.17876015
        },
        {
          "feature": 0,
          "threshold": 1.0291,
          "left": 3,
          "right": 4,
          "value": -0.01404748
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.67754764
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.16830304
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 6,
          "right": 7,
          "value": 0.19106702
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.8012392
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.35068257
        },
        {
          "feature": 0,
          "threshold": 3.8054,
          "left": 9,
          "right": 12,
          "value": -0.02861213
        },
        {
          "feature": 0,
          "threshold": 3.7998,
          "left": 10,
          "right": 11,
          "value": 0.05627278
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.25592907
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 3.53735267
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 13,
          "right": 14,
          "value": -0.03167784
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.04083884
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.98878347
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00249082
        },
        {
          "feature": 1,
          "threshold": 10.5,
          "left": 2,
          "right": 5,
          "value": 0.16129028
        },
        {
          "feature": 0,
          "threshold": 5.0793,
          "left": 3,
          "right": 4,
          "value": 0.0882484
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.61433645
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.02312475
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 6,
          "right": 7,
          "value": 0.19026219
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.33535123
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.71632405
        },
        {
          "feature": 0,
          "threshold": 2.0806,
          "left": 9,
          "right": 12,
          "value": -0.02588812
        },
        {
          "feature": 4,
          "threshold": 45000.0,
          "left": 10,
          "right": 11,
          "value": 0.2129787
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.12940843
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.76344451
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 13,
          "right": 14,
          "value": -0.02684742
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.78439276
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.22785704
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00227445
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 2,
          "right": 5,
          "value": 0.14557241
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 3,
          "right": 4,
          "value": 0.11772818
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.89521814
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.09604836
        },
        {
          "feature": 0,
          "threshold": 5.2317,
          "left": 6,
          "right": 7,
          "value": 0.22009665
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.27639561
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.51697768
        },
        {
          "feature": 0,
          "threshold": 5.7766,
          "left": 9,
          "right": 12,
          "value": -0.02339543
        },
        {
          "feature": 0,
          "threshold": 5.75595,
          "left": 10,
          "right": 11,
          "value": 0.02119927
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.10423017
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 8.72205863
        },
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 13,
          "right": 14,
          "value": -0.02882683
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.1655554
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.03079738
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00212836
        },
        {
          "feature": 1,
          "threshold": 10.5,
          "left": 2,
          "right": 5,
          "value": 0.13146867
        },
        {
          "feature": 0,
          "threshold": 5.0793,
          "left": 3,
          "right": 4,
          "value": 0.06298593
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.48915688
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.01158343
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 6,
          "right": 7,
          "value": 0.15863221
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.26884711
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.63305683
        },
        {
          "feature": 0,
          "threshold": 3.8054,
          "left": 9,
          "right": 12,
          "value": -0.02121365
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 10,
          "right": 11,
          "value": 0.05475171
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.00945705
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.00143102
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 13,
          "right": 14,
          "value": -0.02395722
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.04024375
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.96583872
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 4.0635,
          "left": 1,
          "right": 8,
          "value": -0.00196384
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.10831672
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 3,
          "right": 4,
          "value": -0.03694644
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.4179115
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.63182238
        },
        {
          "feature": 0,
          "threshold": 4.05605,
          "left": 6,
          "right": 7,
          "value": 0.13252725
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.78329304
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 9.63711926
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 9,
          "right": 12,
          "value": -0.02096882
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 10,
          "right": 11,
          "value": 0.00681544
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.23826475
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.69533126
        },
        {
          "feature": 0,
          "threshold": 5.4371,
          "left": 13,
          "right": 14,
          "value": -0.02536375
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.09144186
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.97011892
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00185604
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 2,
          "right": 5,
          "value": 0.10783388
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 3,
          "right": 4,
          "value": -0.0087326
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.62221562
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.20972675
        },
        {
          "feature": 5,
          "threshold": 3.5,
          "left": 6,
          "right": 7,
          "value": 0.12253595
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.12096239
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.53823353
        },
        {
          "feature": 0,
          "threshold": 2.0806,
          "left": 9,
          "right": 12,
          "value": -0.01752603
        },
        {
          "feature": 4,
          "threshold": 90000.0,
          "left": 10,
          "right": 11,
          "value": 0.18688754
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.17464399
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.48817704
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 13,
          "right": 14,
          "value": -0.01834697
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.70590731
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.30413055
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 4.0635,
          "left": 1,
          "right": 8,
          "value": -0.00168897
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.09104991
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 3,
          "right": 4,
          "value": -0.03338663
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.24906468
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.60254661
        },
        {
          "feature": 0,
          "threshold": 4.05605,
          "left": 6,
          "right": 7,
          "value": 0.11178933
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.70996045
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 4.19614094
        },
        {
          "feature": 0,
          "threshold": 4.53005,
          "left": 9,
          "right": 12,
          "value": -0.01767093
        },
        {
          "feature": 0,
          "threshold": 4.49695,
          "left": 10,
          "right": 11,
          "value": -0.09421493
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.75365535
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -2.49428281
        },
        {
          "feature": 0,
          "threshold": 4.54075,
          "left": 13,
          "right": 14,
          "value": -0.01630081
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 10.82678562
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.61869563
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 4.0635,
          "left": 1,
          "right": 8,
          "value": -0.00156821
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.0820339
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 3,
          "right": 4,
          "value": -0.03023663
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.06307529
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.55957643
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 6,
          "right": 7,
          "value": 0.10074566
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.02652988
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.79222596
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 9,
          "right": 12,
          "value": -0.01597561
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 10,
          "right": 11,
          "value": 0.01117804
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.1487984
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.36832142
        },
        {
          "feature": 0,
          "threshold": 5.4371,
          "left": 13,
          "right": 14,
          "value": -0.02027079
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.07399484
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.95188392
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00146352
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 2,
          "right": 5,
          "value": 0.08184703
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 3,
          "right": 4,
          "value": 0.05842047
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.67686372
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.34035156
        },
        {
          "feature": 0,
          "threshold": 5.2317,
          "left": 6,
          "right": 7,
          "value": 0.14454753
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.1667485
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.253326
        },
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 9,
          "right": 12,
          "value": -0.01336503
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 10,
          "right": 11,
          "value": 0.01677961
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.07346438
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.44833469
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 13,
          "right": 14,
          "value": -0.01860142
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.03140562
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.01823439
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00134611
        },
        {
          "feature": 1,
          "threshold": 10.5,
          "left": 2,
          "right": 5,
          "value": 0.07399977
        },
        {
          "feature": 0,
          "threshold": 1.3936,
          "left": 3,
          "right": 4,
          "value": 0.01331991
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.81114363
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.21699768
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 6,
          "right": 7,
          "value": 0.09806832
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.18052499
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.375535
        },
        {
          "feature": 0,
          "threshold": 2.0806,
          "left": 9,
          "right": 12,
          "value": -0.0121098
        },
        {
          "feature": 5,
          "threshold": 3.5,
          "left": 10,
          "right": 11,
          "value": 0.16922359
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.12989708
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.08508394
        },
        {
          "feature": 0,
          "threshold": 2.6906,
          "left": 13,
          "right": 14,
          "value": -0.01283805
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.23025563
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.46745656
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 4.0635,
          "left": 1,
          "right": 8,
          "value": -0.00120149
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 2,
          "right": 5,
          "value": 0.06320731
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 3,
          "right": 4,
          "value": 0.04027855
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.56312949
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.63610879
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 6,
          "right": 7,
          "value": 0.13390433
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.97322437
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.88495181
        },
        {
          "feature": 0,
          "threshold": 4.51965,
          "left": 9,
          "right": 12,
          "value": -0.01230125
        },
        {
          "feature": 0,
          "threshold": 4.49695,
          "left": 10,
          "right": 11,
          "value": -0.08677802
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.74108159
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -2.57406258
        },
        {
          "feature": 0,
          "threshold": 6.07155,
          "left": 13,
          "right": 14,
          "value": -0.01101334
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.44163182
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.89885122
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 4.0635,
          "left": 1,
          "right": 8,
          "value": -0.00111313
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.0570197
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 3,
          "right": 4,
          "value": -0.03599539
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.87551365
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.58934988
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 6,
          "right": 7,
          "value": 0.07252222
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.1295153
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.68060587
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 9,
          "right": 12,
          "value": -0.01113133
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 10,
          "right": 11,
          "value": 0.01204641
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.09467984
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.07650138
        },
        {
          "feature": 0,
          "threshold": 5.4371,
          "left": 13,
          "right": 14,
          "value": -0.0147976
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.06869446
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.92157553
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 4.0635,
          "left": 1,
          "right": 8,
          "value": -0.00104117
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 2,
          "right": 5,
          "value": 0.05140349
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 3,
          "right": 4,
          "value": 0.03081958
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.49365096
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.62074105
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 6,
          "right": 7,
          "value": 0.11487054
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.92210636
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.71703062
        },
        {
          "feature": 0,
          "threshold": 4.51965,
          "left": 9,
          "right": 12,
          "value": -0.01007911
        },
        {
          "feature": 0,
          "threshold": 4.49695,
          "left": 10,
          "right": 11,
          "value": -0.07732772
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.68179396
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -2.27786909
        },
        {
          "feature": 0,
          "threshold": 4.54075,
          "left": 13,
          "right": 14,
          "value": -0.00891619
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 3.40871609
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.47790738
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00094028
        },
        {
          "feature": 0,
          "threshold": 6.7354,
          "left": 2,
          "right": 5,
          "value": 0.05213308
        },
        {
          "feature": 1,
          "threshold": 10.5,
          "left": 3,
          "right": 4,
          "value": 0.04893697
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.08249249
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.6703606
        },
        {
          "feature": 4,
          "threshold": 50000.0,
          "left": 6,
          "right": 7,
          "value": 0.44845014
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.47671135
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.42992271
        },
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 9,
          "right": 12,
          "value": -0.00852219
        },
        {
          "feature": 0,
          "threshold": 6.53925,
          "left": 10,
          "right": 11,
          "value": 0.01718135
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.16231126
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 9.09398261
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 13,
          "right": 14,
          "value": -0.01298713
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.02566604
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.01249045
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 6.07155,
          "left": 1,
          "right": 6,
          "value": -0.00089617
        },
        {
          "feature": 0,
          "threshold": 6.0566,
          "left": 2,
          "right": 5,
          "value": 0.03237529
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 3,
          "right": 4,
          "value": 0.0303314
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.09028382
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.07918244
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 36.45207503
        },
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 7,
          "right": 10,
          "value": -0.01086247
        },
        {
          "feature": 1,
          "threshold": 8.5,
          "left": 8,
          "right": 9,
          "value": 0.13969977
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.63359857
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.80721212
        },
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 11,
          "right": 12,
          "value": -0.01115654
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.25300774
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.01272641
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00103328
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 2,
          "right": 5,
          "value": 0.04362563
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 3,
          "right": 4,
          "value": -0.04703484
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.79303141
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.1046609
        },
        {
          "feature": 5,
          "threshold": 3.5,
          "left": 6,
          "right": 7,
          "value": 0.05506028
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.95430151
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.19411556
        },
        {
          "feature": 0,
          "threshold": 2.84405,
          "left": 9,
          "right": 12,
          "value": -0.00741313
        },
        {
          "feature": 0,
          "threshold": 2.82325,
          "left": 10,
          "right": 11,
          "value": 0.0724082
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.18534783
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 5.27920207
        },
        {
          "feature": 0,
          "threshold": 2.95755,
          "left": 13,
          "right": 14,
          "value": -0.00833592
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.39447433
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.36762867
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 4.0635,
          "left": 1,
          "right": 8,
          "value": -0.00092914
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 2,
          "right": 5,
          "value": 0.03689745
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 3,
          "right": 4,
          "value": -0.04052851
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.74309689
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.60256305
        },
        {
          "feature": 4,
          "threshold": 90000.0,
          "left": 6,
          "right": 7,
          "value": 0.04980177
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.31751394
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.1075499
        },
        {
          "feature": 0,
          "threshold": 4.53005,
          "left": 9,
          "right": 12,
          "value": -0.0074479
        },
        {
          "feature": 4,
          "threshold": 30000.0,
          "left": 10,
          "right": 11,
          "value": -0.07353714
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.64093883
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.430978
        },
        {
          "feature": 0,
          "threshold": 4.54075,
          "left": 13,
          "right": 14,
          "value": -0.00626492
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 3.4777275
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.40394236
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 6.07155,
          "left": 1,
          "right": 8,
          "value": -0.00084663
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 2,
          "right": 5,
          "value": 0.02637942
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 3,
          "right": 4,
          "value": 0.00831435
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.37909976
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.79273453
        },
        {
          "feature": 0,
          "threshold": 4.74525,
          "left": 6,
          "right": 7,
          "value": 0.09883607
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.79844612
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.08879269
        },
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 9,
          "right": 12,
          "value": -0.00900206
        },
        {
          "feature": 0,
          "threshold": 6.7354,
          "left": 10,
          "right": 11,
          "value": 0.12419379
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.52693281
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.65973406
        },
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 13,
          "right": 14,
          "value": -0.00926221
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.31800161
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.01065464
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 6.07155,
          "left": 1,
          "right": 8,
          "value": -0.00079865
        },
        {
          "feature": 1,
          "threshold": 8.5,
          "left": 2,
          "right": 5,
          "value": 0.02373486
        },
        {
          "feature": 0,
          "threshold": 6.04715,
          "left": 3,
          "right": 4,
          "value": -0.03323497
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.37730179
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.96292612
        },
        {
          "feature": 0,
          "threshold": 5.425,
          "left": 6,
          "right": 7,
          "value": 0.04333381
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.28376201
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.27018068
        },
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 9,
          "right": 12,
          "value": -0.00814754
        },
        {
          "feature": 0,
          "threshold": 6.7354,
          "left": 10,
          "right": 11,
          "value": 0.11201042
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.45231542
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.56812893
        },
        {
          "feature": 0,
          "threshold": 6.45065,
          "left": 13,
          "right": 14,
          "value": -0.00838223
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.03328721
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.86674069
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 2.83515,
          "left": 1,
          "right": 8,
          "value": -0.00075847
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 2,
          "right": 5,
          "value": 0.03758553
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 3,
          "right": 4,
          "value": 0.03185854
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.35828651
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.42223309
        },
        {
          "feature": 4,
          "threshold": 90000.0,
          "left": 6,
          "right": 7,
          "value": 0.40602157
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.23354567
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 3.3749214
        },
        {
          "feature": 0,
          "threshold": 2.8379,
          "left": 9,
          "right": 10,
          "value": -0.00492445
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -6.13489185
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 11,
          "right": 12,
          "value": -0.00446295
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.20210024
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.6883206
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 4.0635,
          "left": 1,
          "right": 6,
          "value": -0.00069184
        },
        {
          "feature": 0,
          "threshold": 4.05605,
          "left": 2,
          "right": 5,
          "value": 0.02734011
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 3,
          "right": 4,
          "value": 0.0257455
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.28406567
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.33976232
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.97846931
        },
        {
          "feature": 0,
          "threshold": 4.53005,
          "left": 7,
          "right": 10,
          "value": -0.00552267
        },
        {
          "feature": 0,
          "threshold": 4.49695,
          "left": 8,
          "right": 9,
          "value": -0.06934154
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.66775266
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.96219808
        },
        {
          "feature": 0,
          "threshold": 4.54075,
          "left": 11,
          "right": 12,
          "value": -0.00438032
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.60491831
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.33359646
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 1,
          "right": 6,
          "value": -0.00062627
        },
        {
          "feature": 0,
          "threshold": 6.53925,
          "left": 2,
          "right": 5,
          "value": 0.01834622
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 3,
          "right": 4,
          "value": 0.01682891
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.02557475
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.92557163
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 4.67518142
        },
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 7,
          "right": 10,
          "value": -0.00706904
        },
        {
          "feature": 4,
          "threshold": 50000.0,
          "left": 8,
          "right": 9,
          "value": 0.29476647
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.66814679
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.23304649
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 11,
          "right": 12,
          "value": -0.00747392
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.01591877
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.00706682
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 6.07155,
          "left": 1,
          "right": 8,
          "value": -0.00058784
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 2,
          "right": 5,
          "value": 0.0176473
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 3,
          "right": 4,
          "value": 0.00339212
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.32310558
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.79174517
        },
        {
          "feature": 0,
          "threshold": 4.74525,
          "left": 6,
          "right": 7,
          "value": 0.07482296
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.67547792
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.57067993
        },
        {
          "feature": 0,
          "threshold": 6.44715,
          "left": 9,
          "right": 12,
          "value": -0.00605009
        },
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 10,
          "right": 11,
          "value": -0.03354949
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.38705085
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.02948131
        },
        {
          "feature": 0,
          "threshold": 6.4624,
          "left": 13,
          "right": 14,
          "value": -0.00539142
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 17.83498206
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.83930653
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 2.83515,
          "left": 1,
          "right": 8,
          "value": -0.00061798
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 2,
          "right": 5,
          "value": 0.0277027
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 3,
          "right": 4,
          "value": 0.02250472
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.37701734
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.34384377
        },
        {
          "feature": 4,
          "threshold": 90000.0,
          "left": 6,
          "right": 7,
          "value": 0.36210587
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.19782489
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.67392402
        },
        {
          "feature": 0,
          "threshold": 2.8379,
          "left": 9,
          "right": 10,
          "value": -0.00369495
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -3.97848226
        },
        {
          "feature": 0,
          "threshold": 2.9394,
          "left": 11,
          "right": 12,
          "value": -0.00328178
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.78168246
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.13058429
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 1,
          "right": 8,
          "value": -0.00055234
        },
        {
          "feature": 1,
          "threshold": 10.5,
          "left": 2,
          "right": 5,
          "value": 0.02319549
        },
        {
          "feature": 5,
          "threshold": 13.0,
          "left": 3,
          "right": 4,
          "value": -0.02438386
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.1620436
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.83947633
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 6,
          "right": 7,
          "value": 0.04206775
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.11426895
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.07544715
        },
        {
          "feature": 0,
          "threshold": 1.98285,
          "left": 9,
          "right": 12,
          "value": -0.00394489
        },
        {
          "feature": 0,
          "threshold": 1.89315,
          "left": 10,
          "right": 11,
          "value": 0.13586136
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.29409094
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.78745405
        },
        {
          "feature": 0,
          "threshold": 2.95755,
          "left": 13,
          "right": 14,
          "value": -0.00434548
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.49687742
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.21522562
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 1,
          "right": 8,
          "value": -0.0004792
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 2,
          "right": 5,
          "value": -0.00387073
        },
        {
          "feature": 1,
          "threshold": 13.0,
          "left": 3,
          "right": 4,
          "value": 0.00074067
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.24734389
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.06695983
        },
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 6,
          "right": 7,
          "value": -0.0315391
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.11061871
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.53205005
        },
        {
          "feature": 6,
          "threshold": 3.5,
          "left": 9,
          "right": 12,
          "value": 0.02326147
        },
        {
          "feature": 0,
          "threshold": 4.74525,
          "left": 10,
          "right": 11,
          "value": 0.07799404
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.65230118
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.14082979
        },
        {
          "feature": 0,
          "threshold": 5.8846,
          "left": 13,
          "right": 14,
          "value": -0.01085754
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.14091596
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.00825646
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 1,
          "right": 6,
          "value": -0.00042448
        },
        {
          "feature": 0,
          "threshold": 6.53925,
          "left": 2,
          "right": 5,
          "value": 0.01467152
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 3,
          "right": 4,
          "value": 0.01336322
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.43354709
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.28581474
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 3.09282122
        },
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 7,
          "right": 10,
          "value": -0.00555085
        },
        {
          "feature": 4,
          "threshold": 50000.0,
          "left": 8,
          "right": 9,
          "value": 0.27012457
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.62842226
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.18250901
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 11,
          "right": 12,
          "value": -0.00592064
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.01443683
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.00555334
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 0.7903,
          "left": 1,
          "right": 8,
          "value": -0.000405
        },
        {
          "feature": 1,
          "threshold": 11.5,
          "left": 2,
          "right": 5,
          "value": 0.08640328
        },
        {
          "feature": 5,
          "threshold": 10.5,
          "left": 3,
          "right": 4,
          "value": 0.15871516
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.26968935
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.16390333
        },
        {
          "feature": 0,
          "threshold": 0.0796,
          "left": 6,
          "right": 7,
          "value": 0.06574274
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.30174287
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.0564987
        },
        {
          "feature": 0,
          "threshold": 0.85775,
          "left": 9,
          "right": 12,
          "value": -0.00119337
        },
        {
          "feature": 0,
          "threshold": 0.8348,
          "left": 10,
          "right": 11,
          "value": -0.65724266
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -4.30689053
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.85078456
        },
        {
          "feature": 0,
          "threshold": 1.5988,
          "left": 13,
          "right": 14,
          "value": -0.00019885
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.59915606
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.08405111
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 6.07155,
          "left": 1,
          "right": 8,
          "value": -0.0003514
        },
        {
          "feature": 1,
          "threshold": 8.5,
          "left": 2,
          "right": 5,
          "value": 0.01425916
        },
        {
          "feature": 0,
          "threshold": 6.04715,
          "left": 3,
          "right": 4,
          "value": -0.02607418
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.32628564
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.94584901
        },
        {
          "feature": 0,
          "threshold": 5.425,
          "left": 6,
          "right": 7,
          "value": 0.02813476
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.16386092
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.88759179
        },
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 9,
          "right": 12,
          "value": -0.00472792
        },
        {
          "feature": 1,
          "threshold": 8.5,
          "left": 10,
          "right": 11,
          "value": 0.08573357
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.30438304
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.40845231
        },
        {
          "feature": 0,
          "threshold": 6.45065,
          "left": 13,
          "right": 14,
          "value": -0.0049046
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.03290459
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.79046776
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 4.0635,
          "left": 1,
          "right": 6,
          "value": -0.00034109
        },
        {
          "feature": 0,
          "threshold": 4.05605,
          "left": 2,
          "right": 5,
          "value": 0.01784569
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 3,
          "right": 4,
          "value": 0.01657523
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.19263338
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.24718084
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.63958911
        },
        {
          "feature": 0,
          "threshold": 4.53005,
          "left": 7,
          "right": 10,
          "value": -0.00347527
        },
        {
          "feature": 0,
          "threshold": 4.49695,
          "left": 8,
          "right": 9,
          "value": -0.06589667
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.70064997
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.87702769
        },
        {
          "feature": 0,
          "threshold": 4.54075,
          "left": 11,
          "right": 12,
          "value": -0.00235794
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.22197197
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.23343571
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 1,
          "right": 8,
          "value": -0.0003084
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 2,
          "right": 5,
          "value": -0.0031206
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 3,
          "right": 4,
          "value": 0.00133917
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.3348371
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.74811422
        },
        {
          "feature": 0,
          "threshold": 2.5054,
          "left": 6,
          "right": 7,
          "value": -0.02987922
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.43648404
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.51820974
        },
        {
          "feature": 6,
          "threshold": 3.5,
          "left": 9,
          "right": 12,
          "value": 0.019377
        },
        {
          "feature": 0,
          "threshold": 4.74525,
          "left": 10,
          "right": 11,
          "value": 0.0646847
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.57085771
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.78125355
        },
        {
          "feature": 0,
          "threshold": 5.8846,
          "left": 13,
          "right": 14,
          "value": -0.00886676
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.13539962
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.00636638
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 0.7903,
          "left": 1,
          "right": 6,
          "value": -0.00028707
        },
        {
          "feature": 0,
          "threshold": 0.0796,
          "left": 2,
          "right": 3,
          "value": 0.07507889
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.29351983
        },
        {
          "feature": 1,
          "threshold": 11.5,
          "left": 4,
          "right": 5,
          "value": 0.06614732
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.1680564
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.04668688
        },
        {
          "feature": 0,
          "threshold": 0.85775,
          "left": 7,
          "right": 10,
          "value": -0.00097152
        },
        {
          "feature": 5,
          "threshold": 12.0,
          "left": 8,
          "right": 9,
          "value": -0.57843438
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.92379566
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -4.79241156
        },
        {
          "feature": 0,
          "threshold": 1.30055,
          "left": 11,
          "right": 12,
          "value": -9.614e-05
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.80247018
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.0566546
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 1,
          "right": 6,
          "value": -0.00024699
        },
        {
          "feature": 0,
          "threshold": 6.53925,
          "left": 2,
          "right": 5,
          "value": 0.0114232
        },
        {
          "feature": 1,
          "threshold": 5.5,
          "left": 3,
          "right": 4,
          "value": 0.01027805
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.35466493
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.22893565
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 2.44421578
        },
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 7,
          "right": 10,
          "value": -0.00421001
        },
        {
          "feature": 4,
          "threshold": 50000.0,
          "left": 8,
          "right": 9,
          "value": 0.22080042
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.46565979
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.14140581
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 11,
          "right": 12,
          "value": -0.00451184
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.01342399
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.00414159
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 1,
          "right": 8,
          "value": -0.00023891
        },
        {
          "feature": 1,
          "threshold": 16.0,
          "left": 2,
          "right": 5,
          "value": -0.00266855
        },
        {
          "feature": 1,
          "threshold": 13.0,
          "left": 3,
          "right": 4,
          "value": 0.00144809
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.18272704
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.09650524
        },
        {
          "feature": 0,
          "threshold": 2.5054,
          "left": 6,
          "right": 7,
          "value": -0.0273684
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.26824291
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.48763057
        },
        {
          "feature": 6,
          "threshold": 3.5,
          "left": 9,
          "right": 12,
          "value": 0.01676855
        },
        {
          "feature": 0,
          "threshold": 4.74525,
          "left": 10,
          "right": 11,
          "value": 0.05595105
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.51431525
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.52953402
        },
        {
          "feature": 0,
          "threshold": 5.8846,
          "left": 13,
          "right": 14,
          "value": -0.0076569
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.1230568
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.00553567
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 0.7149,
          "left": 1,
          "right": 6,
          "value": -0.00020633
        },
        {
          "feature": 0,
          "threshold": 0.0796,
          "left": 2,
          "right": 3,
          "value": 0.07020231
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.28615223
        },
        {
          "feature": 1,
          "threshold": 11.5,
          "left": 4,
          "right": 5,
          "value": 0.06004999
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.14912529
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.03849789
        },
        {
          "feature": 0,
          "threshold": 0.85775,
          "left": 7,
          "right": 10,
          "value": -0.00077414
        },
        {
          "feature": 0,
          "threshold": 0.7903,
          "left": 8,
          "right": 9,
          "value": -0.28978942
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.03383591
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -2.20912674
        },
        {
          "feature": 0,
          "threshold": 1.5988,
          "left": 11,
          "right": 12,
          "value": -4.394e-05
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.53580715
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.06719535
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 6.54725,
          "left": 1,
          "right": 6,
          "value": -0.00018129
        },
        {
          "feature": 0,
          "threshold": 6.53925,
          "left": 2,
          "right": 5,
          "value": 0.01035104
        },
        {
          "feature": 1,
          "threshold": 20.0,
          "left": 3,
          "right": 4,
          "value": 0.00939477
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.02099065
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.61675584
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.97717553
        },
        {
          "feature": 6,
          "threshold": 1.5,
          "left": 7,
          "right": 10,
          "value": -0.00375792
        },
        {
          "feature": 4,
          "threshold": 50000.0,
          "left": 8,
          "right": 9,
          "value": 0.1970729
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.41235374
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.11381363
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 11,
          "right": 12,
          "value": -0.00402731
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.01381734
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.00369723
        }
      ]
    },
    {
      "nodes": [
        {
          "feature": 0,
          "threshold": 4.0635,
          "left": 1,
          "right": 8,
          "value": -0.00017452
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 2,
          "right": 5,
          "value": 0.01351197
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 3,
          "right": 4,
          "value": 0.00704139
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.57932439
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.22298332
        },
        {
          "feature": 5,
          "threshold": 0.5,
          "left": 6,
          "right": 7,
          "value": 0.07749882
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 1.79159888
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.06954301
        },
        {
          "feature": 0,
          "threshold": 4.5091,
          "left": 9,
          "right": 12,
          "value": -0.00253315
        },
        {
          "feature": 0,
          "threshold": 4.49695,
          "left": 10,
          "right": 11,
          "value": -0.06450956
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.7044897
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -1.96047882
        },
        {
          "feature": 6,
          "threshold": 2.5,
          "left": 13,
          "right": 14,
          "value": -0.00149898
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": 0.38895153
        },
        {
          "feature": -2,
          "threshold": -2.0,
          "left": -1,
          "right": -1,
          "value": -0.81326657
        }
      ]
    }
  ]
} as const;

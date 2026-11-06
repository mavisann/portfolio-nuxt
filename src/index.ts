import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent'

// Remaining import statements

const options = {
    "info": {
        "applicationID": 1120583149,
        "beacon": "bam.nr-data.net",
        "errorBeacon": "bam.nr-data.net",
        "licenseKey": "NRJS-8fd04103d307bacebf1",
        "sa": 1
    },
    "init": {
        "ajax": {
            "deny_list": [
                "bam.nr-data.net"
            ]
        },
        "browser_consent_mode": {
            "enabled": false
        },
        "distributed_tracing": {
            "enabled": true
        },
        "performance": {
            "capture_detail": false,
            "capture_marks": false,
            "capture_measures": true
        },
        "privacy": {
            "cookies_enabled": true
        }
    },
    "loader_config": {
        "accountID": 8706990,
        "agentID": 1120583149,
        "applicationID": 1120583149,
        "licenseKey": "NRJS-8fd04103d307bacebf1",
        "trustKey": 8706990
    }
}

// The agent loader code executes immediately on instantiation.
const nrba = new BrowserAgent(options)

// Remaining code

class Utils {
    getInitialConfig(index) {
        switch (index) {
            case 1:
                return {
                    x: 20,
                    y: 20,
                    color: 'red',
                    command: 40
                };
            case 2:
                return {
                    x: 20,
                    y: 450,
                    color: 'blue',
                    command: 38
                };
            case 3:
                return {
                    x: 450,
                    y: 20,
                    color: 'green',
                    command: 40
                };
            case 4:
                return {
                    x: 450,
                    y: 450,
                    color: 'black',
                    command: 38
                };
        }
    }
}
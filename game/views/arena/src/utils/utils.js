class Utils {
    getInitialConfig(index) {
        switch (index) {
            case 1:
                return {
                    x: 20,
                    y: 20,
                    color: 'red'
                };
            case 2:
                return {
                    x: 200,
                    y: 20,
                    color: 'blue'
                };
            case 3:
                return {
                    x: 400,
                    y: 20,
                    color: 'green'
                };
            case 4:
                return {
                    x: 600,
                    y: 20,
                    color: 'black'
                };
        }
    }
}
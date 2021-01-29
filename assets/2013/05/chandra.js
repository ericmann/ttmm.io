( function( window, undefined ) {
    var md, rd;
    
    // Constants
    var MU = 2.0;
        G = 6.626 * Math.pow( 10, -8 ),
        PI = 3.14159,
        MS = 1.989 * Math.pow( 10, 33 ),
        RS = 6.96 * Math.pow( 10, 10 ),
        CSQ = Math.pow( 2.9979 * Math.pow( 10, 10 ), 2 );
		
    function Dwarf( rho, r, m ) {
        var SELF = this;
		
        function pressure( offset ) {
            offset = offset || 1;
			
            var x = 1.009 * Math.pow( 10, -2 ) * Math.pow( offset * rho / MU, 1 / 3 );
            var f = x * ( 2 * Math.pow( x, 2 ) - 3 ) * Math.sqrt( Math.pow( x, 2 ) + 1 ) + 3 * Math.log( x + Math.sqrt( Math.pow( x, 2 ) + 1 ) );
            var p = 6.003 * Math.pow( 10, 22 ) * f;
			
            return p;
        }
		
        function pressure_to_radius() {
            return -G * m * rho / ( r * r );
        }
		
        function relativistic_modifiers( p ) {
            var density = 1 + p / ( rho * CSQ ),
                mass = 1 + 4 * PI * Math.pow( r, 3 ) * p / ( m * CSQ ),
                radius = 1 / ( 1 - 2 * G * m / ( r * CSQ ) );
			
            return density * mass * radius
        }
		
        SELF.doStep = function( relativistic ) {
            relativistic = relativistic || false;
		
            var pa = pressure( 0.99 ),
                pb = pressure( 1.01 ),
                p = pressure();
				
            var pressure_to_rho = ( pb - pa ) / (1.01 * rho - 0.99 * rho );
            var rho_to_radius = pressure_to_radius() / pressure_to_rho;
			
            if ( relativistic ) {
                rho_to_radius *= relativistic_modifiers( p );
            }
            
            // Calculate new step
            var dr = 0.05 * Math.abs( rho / rho_to_radius );
            dr = Math.min( dr, 0.1 * r );
            
            var rhonew = rho + rho_to_radius * dr;
            var mnew = m + 4 * PI * r * r * rho * dr;
            var rnew = r + dr;
			
            rho = rhonew;
            m = mnew;
            r = rnew;
			
            return rho;
        };
		
        SELF.mass = function() {
            return m / MS;
        };
		
        SELF.radius = function() {
            return r / RS;
        };
    }

    var classical_set = [],
        relative_set = [];
	
    for( var loop = 0; loop < 50; loop++ ) {       
        var rho = Math.pow( 10, 5 ) * Math.pow( Math.sqrt( 10 ), loop / 2.5 ),
            r = 10,
            m = 4 / 3 * PI * Math.pow( r, 3 ) * rho;
        
        var classical = new Dwarf( rho, r, m );
		
        while ( rho > 100 ) {
            rho = classical.doStep();
        }
		
        rho = Math.pow( 10, 5 ) * Math.pow( Math.sqrt( 10 ), loop );
        r = 10;
        m = 4 / 3 * PI * Math.pow( r, 3 ) * rho;
		
        var relative = new Dwarf( rho, r, m );
		
        while ( rho > 100 ) {
            rho = relative.doStep( true );
        }
		
        classical_set.push( [ classical.mass(), classical.radius() ] );
        relative_set.push( [ relative.mass(), relative.radius() ] );
    }
	
    window.dataset = [ classical_set, relative_set ];    
} )( this );
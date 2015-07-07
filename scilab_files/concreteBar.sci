//***** Universidad Católica
//************ Manuel Alonso - Máximo Belén
//**************** Trabajo final

// Condiciones iniciales
Tt0 = 100
Tborde = 25
Ttf = 25

// Dimensiones barra
Lx = 10
Ly = 2
Lz = 5

tf = 0,66// Estimacion del tiempo final

h = 0.2 // Medida en que se divide cada eje de la barra

ht = 0,0066

// Cantidad partes para cada dimension
Nt = 100
abort

Nx = Lx/h
Ny = Ly/h
Nz = Lz/h


//Creo una matriz para el sistema de ecuaciones
//cantidad de pasos mas uno para el termino independiente
dimMatriz = (Nt+1) * (Nx+1) * (Ny+1) * (Nz+1);
disp(dimMatriz)
global M
M = spzeros( dimMatriz , dimMatriz)
global b
b = zeros(dimMatriz,1)


function armarMatriz()
    
    delta = ht/(h**2)

    global M
    global b
    
    // Contador
    n = 1
                   
    for i = 0:Nt
        for j = 0:Nx
            for k = 0:Ny
                for l = 0:Nz
                    if j<1 | k<1 | l<1 | j==Nx | k==Ny | l==Nz | i == Nt// Punto borde o tiempo final
                            M(n, n) = 1
                            b(n) = Tborde
                    else if i == 0 // Punto interno temperatura inicial
                           M(n, n) = 1
                           b(n) = Tt0
                        else
                            M(n, n) = -1
                            b(n) = 0
                            calculoPrimerTermino(i-1, j, k, l, delta,n,n- ((Nx+1) * (Ny+1) * (Nz+1)))
                    
                            calculoSegundoTermino(i-1, j, k, l-1,delta,n,n-1)
                            calculoSegundoTermino(i-1, j, k, l+1,delta,n,n+1)
                            calculoSegundoTermino(i-1, j, k-1, l,delta,n,n - (Nz+1))
                            calculoSegundoTermino(i-1, j, k+1, l, delta,n,n + (Nz+1))
                            calculoSegundoTermino(i-1, j-1, k, l, delta,n,n - ((Ny+1) * (Nz+1)))
                            calculoSegundoTermino(i-1, j+1, k, l, delta,n,n + ((Ny+1) * (Nz+1)))
                        end
                    end                                     
                    n = n + 1
                               
                end
            end
            disp(j)
        end
        disp(i)
    end
   
endfunction

function I=indice(t, x, y, z)
    
    I = z + (y-1) * Nz + (x-1) * Ny + (t-1) * Nx

endfunction

function calculoPrimerTermino(t, x, y, z, delta,f,c)
    global M
    global b
  

    // Si es un punto interno en un instante siguiente 
    M(f, c) = (1 - (6 * delta))
    
endfunction

function calculoSegundoTermino(t, x, y, z,delta,f,c)
    global M
    global b

    // Si es un punto interno en un instante siguiente 
    M(f, c) = delta
    
endfunction

function [m,er,x] = jacobi(A, f, x, max_iter, TOL)
    
    er = [];
    iD = diag((diag(A)).^(-1));
    L = -tril(A,-1);
    U = -triu(A,1);
    normf = norm(f);
    
    iter = max_iter;
    i = 1;
    while (i <= max_iter)
      x = x - iD*(A*x - f);
      if (normf)
        er = [er; norm(A*x - f)/normf];
      else
        er = [er; norm(x)];
      end
      if (er(i) < TOL)
        iter = i;
        i = max_iter;
      end
      i = i + 1;
      disp(i)
    end
    m = iter;

endfunction

// Set scilab stacksize
stacksize(268435454)
gstacksize('max') 

armarMatriz()

// Resolver sistema
first = ones(dimMatriz,1)*60

[m,er,result] = jacobi(M,b,first,100,0.01)
disp(m)
// Save in file
filename = fullfile(pwd(), "a.csv");
filename2 = fullfile(pwd(), "b.csv");
filename3 = fullfile(pwd(), "result.csv");
//r = (M\b)
A = full(M(1:300,1:300))
csvWrite(A, filename,ascii(9));
csvWrite(b, filename2,ascii(9));
csvWrite(result, filename3,ascii(9));
//fprintfMat("/home/manu/Escritorio/pop/calc", a, "%5.2f");

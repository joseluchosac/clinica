<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ficha Clínica - {{ $patient['last_name'] }} {{ $patient['first_name'] }}</title>
    <style>
        /* Aquí puedes poner tus estilos personalizados */
        @font-face {
            font-family: 'SairaCondensed';
            src: url("{{ public_path('fonts/SairaCondensed-Regular.ttf') }}") format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Agency FB';
            src: url("{{ public_path('fonts/agencyr.ttf') }}") format('truetype');
            font-weight: normal;
            font-style: normal;
        }
        @font-face {
            font-family: 'Agency FB';
            src: url("{{ public_path('fonts/agencyb.ttf') }}") format('truetype');
            font-weight: bold;
            font-style: normal;
        }

        body {
            /* font-family: 'Agency FB', sans-serif; */
          }
        .font-agencyr{
          font-family: 'Agency FB', sans-serif;
          font-weight: normal
        }
        .font-agencyb{
          font-family: 'Agency FB', sans-serif;
          font-weight: bold
        }
        .font-sans-serif{
          font-family: sans-serif;
        }
        .main{
          /* border: solid 1px black; */
          width: 18.5cm;
          height: 13cm;
          margin-left: 10px;
          /* transform: rotate(-90deg) */
        }
        .table-header, .table-paciente, .table-acompaniante, .table-otros-datos {
          border-collapse: collapse;
          width: 100%;
        }

        .table-header td {
          border: 1px solid #ddd;
        }

        .table-paciente td, .table-acompaniante td, .table-otros-datos td {
          border: 1px solid #000;
        }
        .table-otros-datos td {
          padding: 5px;
          height: 15px;
        }

        .title {
          padding: 5px;
          margin-top: 10px;
          background-color: #ddd
        }
        .italic{
            font-style: italic
        }

        .colum-label {
          width: 3cm;
        }
        .colum-data {
          width: 6cm;
        }

        .font-12{font-size: 1.2rem;}
        .font-11{font-size: 1.1rem;}
        .font-10{font-size: 1rem;}
        .font-095{font-size: 0.95rem;}
        .font-09{font-size: 0.9rem;}
        .font-08{font-size: 0.8rem;}
        .font-07{font-size: 0.7rem;}
        .font-06{font-size: 0.6rem;}
        .text-center {text-align: center;}
        .text-right {text-align: right;}
        .text-left {text-align: left;}
        .color-gray {color: darkblue;}



    </style>
</head>
<body>
  <div class="main">
    <table class="table-header font-08">
      <tr>
        <td rowspan="3">
          <div class="font-095 text-center" style="color: darkblue">CONGREGACION NUESTRA SEÑORA DE LA PAZ</div>
          <div class="font-12 text-center" style="color: darkblue; font-weight: bold">POLICLINICO REYNA DE LA PAZ</div>
          <div class="font-07 text-center font-sans-serif">AV. ELMER FAUCETT 472 CARMEN DE LA LEGUA REYNOSO CALLAO</div>
          <div class="font-07 text-center font-sans-serif">Telef. 4519661</div>
        </td>
        <td class="font-agencyr">NHC</td>
        <td class="text-right font-agencyb">{{ $patient['nhc'] }}</td>
      </tr>
      <tr>
        <td class="font-agencyr">FECHA</td>
        <td class="text-right font-agencyb">{{Carbon\Carbon::parse(now())->format('d/m/Y') }}</td>
      </tr>
      <tr>
        <td class="font-agencyr">HORA DE IMPRESION</td>
        <td class="text-right font-agencyb">{{Carbon\Carbon::parse(now())->format('h:i a') }}</td>
      </tr>
    </table>

    <div class="title text-center font-12 font-sans-serif">
      HOJA DE IDENTIFICACIÓN DEL PACIENTE
    </div>
    <table class="table-paciente font-09 font-agencyr">
      <tr>
        <td class="colum-label">FECHA DE INGRESO</td>
        <td class="colum-data font-agencyb">{{$patient['entry_at'] ? \Carbon\Carbon::parse($patient['entry_at'])->format('d/m/Y') : '' }}</td>
        <td class="colum-label">HORA</td>
        <td class="colum-data font-agencyb">{{$patient['entry_at'] ? \Carbon\Carbon::parse($patient['entry_at'])->format('h:i a') : ''}}</td>
      </tr>
      <tr>
        <td class="colum-label">APELLIDOS</td>
        <td class="colum-data font-agencyb" colspan="3">{{ $patient['last_name'] ?? '' }}</td>
      </tr>
      <tr>
        <td class="colum-label">NOMBRES</td>
        <td class="colum-data font-agencyb">{{ $patient['first_name'] ?? '' }}</td>
        <td class="colum-label">{{$patient['identity'] ? $patient['identity']['name'] : 'Sin documento'}}</td>
        <td class="colum-data font-agencyb">{{$patient['identity_number'] ?? ''}}</td>
      </tr>
      <tr>
        <td class="colum-label">SEXO</td>
        <td class="colum-data font-agencyb">{{ $patient['gender'] ?? ''}}</td>
        <td class="colum-label">LUGAR DE NACIM</td>
        <td class="colum-data font-agencyb">{{$patient['location_birth'] ? $patient['location_birth']['location_name'] :  ''}}</td>
      </tr>
      <tr>
        <td class="colum-label">FECHA NACIM.</td>
        <td class="colum-data font-agencyb">{{$patient['birth_date'] ? \Carbon\Carbon::parse($patient['birth_date'])->format('d/m/Y') : '' }}</td>
        <td class="colum-label">EMAIL</td>
        <td class="colum-data font-agencyb">{{$patient['email'] ?? ''}}</td>
      </tr>
      <tr>
        <td class="colum-label">NACIONALIDAD</td>
        <td class="colum-data font-agencyb"></td>
        <td class="colum-label">GRADO DE INSTR.</td>
        <td class="colum-data font-agencyb"></td>
      </tr>
      <tr>
        <td class="colum-label">TELEFONO</td>
        <td class="colum-data font-agencyb">{{$patient['phone'] ?? ''}}</td>
        <td class="colum-label">OCUPACION</td>
        <td></td>
      </tr>
      <tr>
        <td class="colum-label">ESTADO CIVIL</td>
        <td class="colum-data font-agencyb"></td>
        <td class="colum-label">RELIGION</td>
        <td class="colum-data font-agencyb"></td>
      </tr>

      <tr>
        <td class="colum-label">PROCEDENCIA</td>
        <td class="font-agencyb" colspan="3"></td>
      </tr>
      <tr>
        <td class="colum-label">DEPARTAMENTO</td>
        <td class="colum-data font-agencyb">{{$patient['location_address'] ? $patient['location_address']['departamento'] : ''}}</td>
        <td class="colum-label">PROVINCIA</td>
        <td class="colum-data font-agencyb">{{$patient['location_address'] ? $patient['location_address']['provincia'] : ''}}</td>
      </tr>
      <tr>
        <td class="colum-label">DISTRITO</td>
        <td class="font-agencyb" colspan="3">{{$patient['location_address'] ? $patient['location_address']['distrito'] : ''}}</td>
      </tr>
      <tr>
        <td class="colum-label">DIRECCION DOMIC</td>
        <td class="font-agencyb" colspan="3">{{$patient['address'] ?? ''}}</td>
      </tr>
    </table>

    <div class="font-sans-serif" style="margin-top:20px">
      DATOS DEL ACOMPAÑANTE O RESPONSABLE
    </div>
    <table class="table-acompaniante font-09 font-agencyr">
      <tr>
        <td class="colum-label">APELLIDOS Y NOMBRES</td>
        <td class="colum-data font-agencyb"></td>
        <td class="colum-label">FECHA DE NACIMIENTO</td>
        <td class="colum-data font-agencyb"></td>
      </tr>
      <tr>
        <td class="colum-label">PARENTESCO</td>
        <td class="colum-data font-agencyb"></td>
        <td class="colum-label">DNI</td>
        <td class="colum-data font-agencyb"></td>
      </tr>
      <tr>
        <td class="colum-label">TELEFONO</td>
        <td class="colum-data font-agencyb"></td>
        <td class="colum-label">CELULAR</td>
        <td class="colum-data font-agencyb"></td>
      </tr>
      <tr>
        <td>DIRECCION</td>
        <td class="font-agencyb" colspan="3"></td>
      </tr>
      <tr>
        <td class="colum-label">CONTACTO</td>
        <td class="colum-data font-agencyb"></td>
        <td class="colum-label">CELULAR</td>
        <td class="colum-data font-agencyb"></td>
      </tr>
    </table>

    <div class="font-sans-serif" style="margin-top:20px">
      OTROS DATOS
    </div>
    <table class="table-otros-datos font-09 font-agencyr">
      <tr>
        <td colspan="4">REFERIDO POR</td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
      <tr>
        <td colspan="4"></td>
      </tr>
    </table>
    <div class="text-center font-09" style="border-top: 1px solid black; margin-top: 80px; padding-top:10px">
      Personal que registró los datos del paciente
    </div>


  </div>
</body>
</html>